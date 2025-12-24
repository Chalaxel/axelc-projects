import { models } from '../models/models';
import {
    Order,
    OrderStatus,
    CreateOrderRequest,
    ShippingInfo,
    ValidateOrderRequest,
} from '@monorepo/shared-types';
import { ProductVariantService } from './ProductVariantService';
import { NotificationService } from './NotificationService';
import { EmailService } from './EmailService';
import { Op } from 'sequelize';

export class OrderService {
    // Générer un numéro de commande unique
    private static async generateOrderNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const prefix = `ORD-${year}-`;

        // Trouver le dernier numéro de commande de l'année
        const lastOrder = await models.order.findOne({
            where: {
                orderNumber: {
                    [Op.like]: `${prefix}%`,
                },
            },
            order: [['createdAt', 'DESC']],
        });

        let nextNumber = 1;
        if (lastOrder) {
            const lastNumber = parseInt(lastOrder.orderNumber.split('-').pop() || '0');
            nextNumber = lastNumber + 1;
        }

        return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
    }

    // Créer une nouvelle commande
    static async createOrder(orderRequest: CreateOrderRequest): Promise<Order> {
        try {
            // Vérifier la disponibilité du stock pour chaque variante
            for (const item of orderRequest.cartItems) {
                const variant = await ProductVariantService.getVariantById(item.variantId);

                if (!variant) {
                    throw new Error(`Variante ${item.variantId} introuvable`);
                }

                if (variant.status !== 'available') {
                    throw new Error(`La variante ${variant.name} n'est plus disponible`);
                }

                // Vérifier que le stock est suffisant pour la quantité demandée
                const stockCheck = await ProductVariantService.checkStockAvailability(
                    item.variantId,
                    item.quantity,
                );
                if (!stockCheck.available) {
                    throw new Error(
                        `Stock insuffisant pour ${variant.name}. Disponible: ${stockCheck.currentStock}, Demandé: ${item.quantity}`,
                    );
                }
            }

            // Générer le numéro de commande
            const orderNumber = await this.generateOrderNumber();

            // Calculer le montant total
            const totalAmount = orderRequest.cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
            );

            // Créer la commande avec statut pending_validation
            const order = await models.order.create({
                orderNumber,
                status: 'pending_validation',
                paymentMethod: orderRequest.paymentMethod,
                paymentId: orderRequest.paymentId,
                totalAmount,
                shippingInfo: orderRequest.shippingInfo,
            } as any);

            // Créer les items de commande
            for (const item of orderRequest.cartItems) {
                await models.orderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    variantId: item.variantId,
                    price: item.price,
                    quantity: item.quantity,
                });
            }

            // Décrémenter le stock pour chaque variante commandée
            for (const item of orderRequest.cartItems) {
                await ProductVariantService.decrementStock(item.variantId, item.quantity);
            }

            // Récupérer la commande complète avec les items
            const fullOrder = await this.getOrderById(order.id);

            if (!fullOrder) {
                throw new Error('Erreur lors de la récupération de la commande créée');
            }

            // Créer une notification
            await NotificationService.createOrderNotification(fullOrder.id, fullOrder.orderNumber);

            // Envoyer un email au client (demande reçue)
            await EmailService.sendOrderPendingValidationEmail(fullOrder);

            // Envoyer un email à l'admin (nouvelle commande à valider)
            await EmailService.sendAdminNewOrderEmail(fullOrder);

            return fullOrder;
        } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            throw error;
        }
    }

    // Récupérer une commande par son ID
    static async getOrderById(orderId: string): Promise<Order | null> {
        try {
            const order = await models.order.findByPk(orderId, {
                include: [
                    {
                        model: models.orderItem,
                        as: 'items',
                        include: [
                            {
                                model: models.product,
                                as: 'product',
                            },
                            {
                                model: models.productVariant,
                                as: 'variant',
                            },
                        ],
                    },
                ],
            });

            if (!order) {
                return null;
            }

            return order.toJSON() as Order;
        } catch (error) {
            console.error('Erreur lors de la récupération de la commande:', error);
            throw new Error('Impossible de récupérer la commande');
        }
    }

    // Récupérer toutes les commandes (avec filtres optionnels)
    static async getOrders(
        status?: OrderStatus,
        limit = 50,
        offset = 0,
    ): Promise<{ orders: Order[]; total: number }> {
        try {
            const where = status ? { status } : {};

            const { count, rows } = await models.order.findAndCountAll({
                where,
                include: [
                    {
                        model: models.orderItem,
                        as: 'items',
                        include: [
                            {
                                model: models.product,
                                as: 'product',
                            },
                            {
                                model: models.productVariant,
                                as: 'variant',
                            },
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });

            return {
                orders: rows.map((order) => order.toJSON() as Order),
                total: count,
            };
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            throw new Error('Impossible de récupérer les commandes');
        }
    }

    // Mettre à jour le statut d'une commande
    static async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order | null> {
        try {
            const order = await models.order.findByPk(orderId);

            if (!order) {
                return null;
            }

            // Si le statut passe à 'paid', marquer les variantes comme vendues
            if (
                newStatus === 'paid' &&
                ['pending', 'validated_awaiting_payment'].includes(order.status)
            ) {
                const items = await models.orderItem.findAll({
                    where: { orderId },
                });

                for (const item of items) {
                    await ProductVariantService.updateStatus(item.variantId, 'sold');
                }

                // Créer une notification de paiement
                await NotificationService.createPaymentNotification(
                    orderId,
                    order.orderNumber,
                    order.totalAmount,
                );

                // Envoyer email de confirmation au client et notification à l'admin
                const paidOrder = await this.getOrderById(orderId);
                if (paidOrder) {
                    await EmailService.sendOrderConfirmationEmail(paidOrder);
                    await EmailService.sendAdminPaymentReceivedEmail(paidOrder);
                }
            }

            // Si la commande est annulée, remettre le stock
            if (newStatus === 'cancelled') {
                const items = await models.orderItem.findAll({
                    where: { orderId },
                });

                for (const item of items) {
                    await ProductVariantService.incrementStock(item.variantId, item.quantity);
                }
            }

            await order.update({ status: newStatus });

            return this.getOrderById(orderId);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            throw new Error('Impossible de mettre à jour le statut');
        }
    }

    // Mettre à jour les informations de livraison
    static async updateShippingInfo(
        orderId: string,
        shippingUpdate: Partial<ShippingInfo>,
    ): Promise<Order | null> {
        try {
            const order = await models.order.findByPk(orderId);

            if (!order) {
                return null;
            }

            const updatedShippingInfo = {
                ...order.shippingInfo,
                ...shippingUpdate,
            };

            await order.update({ shippingInfo: updatedShippingInfo });

            return this.getOrderById(orderId);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des infos de livraison:', error);
            throw new Error('Impossible de mettre à jour les informations de livraison');
        }
    }

    // Mettre à jour les notes d'une commande
    static async updateOrderNotes(orderId: string, notes: string): Promise<Order | null> {
        try {
            const order = await models.order.findByPk(orderId);

            if (!order) {
                return null;
            }

            await order.update({ notes });

            return this.getOrderById(orderId);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des notes:', error);
            throw new Error('Impossible de mettre à jour les notes');
        }
    }

    // Mettre à jour le checkoutId d'une commande
    static async updateCheckoutId(orderId: string, checkoutId: string): Promise<Order | null> {
        try {
            const order = await models.order.findByPk(orderId);

            if (!order) {
                return null;
            }

            await order.update({ checkoutId });

            return this.getOrderById(orderId);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du checkoutId:', error);
            throw new Error('Impossible de mettre à jour le checkoutId');
        }
    }

    // Valider ou refuser une commande (admin)
    static async validateOrder(
        orderId: string,
        request: ValidateOrderRequest,
    ): Promise<Order | null> {
        try {
            const order = await models.order.findByPk(orderId);

            if (!order) {
                return null;
            }

            if (order.status !== 'pending_validation') {
                throw new Error('Cette commande ne peut pas être validée');
            }

            if (request.approved) {
                // Calculer nouveau total avec frais de livraison
                const newTotal = order.totalAmount + (request.shippingCost || 0);

                // Mettre à jour commande
                const expirationDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
                await order.update({
                    status: 'validated_awaiting_payment',
                    shippingCost: request.shippingCost,
                    totalAmount: newTotal,
                    validatedAt: new Date(),
                    paymentLinkExpiresAt: expirationDate,
                });

                // Récupérer la commande mise à jour
                const updatedOrder = await this.getOrderById(orderId);

                if (updatedOrder) {
                    // Envoyer email avec lien de paiement
                    await EmailService.sendPaymentLinkEmail(updatedOrder);
                }

                return updatedOrder;
            } else {
                // Refuser la commande
                await order.update({ status: 'cancelled' });

                // Remettre le stock pour chaque variante
                const items = await models.orderItem.findAll({ where: { orderId } });
                for (const item of items) {
                    await ProductVariantService.incrementStock(item.variantId, item.quantity);
                }

                const cancelledOrder = await this.getOrderById(orderId);

                if (cancelledOrder) {
                    // Envoyer email de refus
                    await EmailService.sendOrderRefusedEmail(cancelledOrder, request.refusalReason);
                }

                return cancelledOrder;
            }
        } catch (error) {
            console.error('Erreur lors de la validation de la commande:', error);
            throw error;
        }
    }

    // Vérifier et annuler les commandes avec liens de paiement expirés
    static async checkExpiredPaymentLinks(): Promise<void> {
        try {
            const expiredOrders = await models.order.findAll({
                where: {
                    status: 'validated_awaiting_payment',
                    paymentLinkExpiresAt: { [Op.lt]: new Date() },
                },
            });

            for (const order of expiredOrders) {
                await this.cancelOrder(order.id, 'Lien de paiement expiré (délai de 48h dépassé)');
                console.log(`Commande ${order.orderNumber} annulée (lien expiré)`);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification des liens expirés:', error);
        }
    }

    // Annuler une commande (utilisé quand l'utilisateur abandonne le paiement ou expiration)
    static async cancelOrder(orderId: string, cancellationReason?: string): Promise<Order | null> {
        try {
            const order = await models.order.findByPk(orderId);

            if (!order) {
                return null;
            }

            // Vérifier que la commande peut être annulée
            if (
                ![
                    'pending',
                    'pending_validation',
                    'validated_awaiting_payment',
                    'reserved',
                ].includes(order.status)
            ) {
                throw new Error('Cette commande ne peut pas être annulée');
            }

            // Récupérer les items de la commande
            const items = await models.orderItem.findAll({
                where: { orderId },
            });

            // Remettre le stock pour chaque variante
            for (const item of items) {
                await ProductVariantService.incrementStock(item.variantId, item.quantity);
            }

            // Préparer la mise à jour avec metadata si un motif est fourni
            const updateData: { status: OrderStatus; metadata?: Record<string, unknown> } = {
                status: 'cancelled',
            };

            if (cancellationReason) {
                updateData.metadata = {
                    ...(order.metadata || {}),
                    cancellationReason,
                };
            }

            // Mettre à jour le statut de la commande
            await order.update(updateData);

            // Récupérer la commande complète avec les items pour l'email
            const cancelledOrder = await this.getOrderById(orderId);

            // Envoyer un email d'annulation au client si un motif est fourni
            if (cancelledOrder && cancellationReason) {
                await EmailService.sendOrderCancelledEmail(cancelledOrder, cancellationReason);
            }

            return cancelledOrder;
        } catch (error) {
            console.error("Erreur lors de l'annulation de la commande:", error);
            throw error;
        }
    }

    // Obtenir les statistiques de vente
    static async getSalesStats(
        startDate?: Date,
        endDate?: Date,
    ): Promise<{
        totalRevenue: number;
        totalOrders: number;
        ordersByStatus: Record<OrderStatus, number>;
        recentOrders: Order[];
    }> {
        try {
            const where: any = {};

            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate) {
                    where.createdAt[Op.gte] = startDate;
                }
                if (endDate) {
                    where.createdAt[Op.lte] = endDate;
                }
            }

            const orders = await models.order.findAll({
                where,
                include: [
                    {
                        model: models.orderItem,
                        as: 'items',
                        include: [
                            {
                                model: models.product,
                                as: 'product',
                            },
                            {
                                model: models.productVariant,
                                as: 'variant',
                            },
                        ],
                    },
                ],
            });

            const totalRevenue = orders
                .filter((o) => o.status !== 'cancelled')
                .reduce((sum, order) => sum + order.totalAmount, 0);

            const totalOrders = orders.length;

            const ordersByStatus = orders.reduce(
                (acc, order) => {
                    acc[order.status] = (acc[order.status] || 0) + 1;
                    return acc;
                },
                {} as Record<OrderStatus, number>,
            );

            const recentOrders = await models.order.findAll({
                where,
                include: [
                    {
                        model: models.orderItem,
                        as: 'items',
                        include: [
                            {
                                model: models.product,
                                as: 'product',
                            },
                            {
                                model: models.productVariant,
                                as: 'variant',
                            },
                        ],
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit: 10,
            });

            return {
                totalRevenue,
                totalOrders,
                ordersByStatus,
                recentOrders: recentOrders.map((o) => o.toJSON() as Order),
            };
        } catch (error) {
            console.error('Erreur lors du calcul des statistiques:', error);
            throw new Error('Impossible de calculer les statistiques');
        }
    }
}
