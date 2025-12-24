import { Request } from 'express';
import { Route, Method } from '../types';
import { OrderService } from '../services/OrderService';
import { SumUpService } from '../services/SumUpService';
import { CreateOrderRequest, OrderStatus, ValidateOrderRequest } from '@monorepo/shared-types';

// Middleware de protection vide pour le moment (à implémenter avec authentification)
const adminMiddleware = (req: Request, res: any, next: any) => {
    // TODO: Ajouter vérification d'authentification
    next();
};

export const ordersRoutes: Route[] = [
    // Créer une nouvelle commande
    {
        path: '/',
        method: Method.POST,
        handler: async (req: Request) => {
            const orderRequest: CreateOrderRequest = req.body;
            return await OrderService.createOrder(orderRequest);
        },
    },
    // Récupérer toutes les commandes (admin)
    {
        path: '/',
        method: Method.GET,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const { status, limit, offset } = req.query;
            return await OrderService.getOrders(
                status as OrderStatus | undefined,
                limit ? parseInt(limit as string) : undefined,
                offset ? parseInt(offset as string) : undefined,
            );
        },
    },
    // Récupérer une commande par ID
    {
        path: '/:orderId',
        method: Method.GET,
        handler: async (req: Request) => {
            const { orderId } = req.params;
            const order = await OrderService.getOrderById(orderId);

            if (!order) {
                throw new Error('Commande introuvable');
            }

            return order;
        },
    },
    // Annuler une commande (admin)
    {
        path: '/:orderId/cancel',
        method: Method.POST,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const { orderId } = req.params;
            const { reason } = req.body;
            const order = await OrderService.cancelOrder(orderId, reason);

            if (!order) {
                throw new Error('Commande introuvable');
            }

            return order;
        },
    },
    // Mettre à jour le statut d'une commande (admin)
    {
        path: '/:orderId/status',
        method: Method.PATCH,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const { orderId } = req.params;
            const { status } = req.body;

            const order = await OrderService.updateOrderStatus(orderId, status as OrderStatus);

            if (!order) {
                throw new Error('Commande introuvable');
            }

            return order;
        },
    },
    // Mettre à jour les informations de livraison (admin)
    {
        path: '/:orderId/shipping',
        method: Method.PATCH,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const { orderId } = req.params;
            const shippingUpdate = req.body;

            const order = await OrderService.updateShippingInfo(orderId, shippingUpdate);

            if (!order) {
                throw new Error('Commande introuvable');
            }

            return order;
        },
    },
    // Mettre à jour les notes d'une commande (admin)
    {
        path: '/:orderId/notes',
        method: Method.PATCH,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const { orderId } = req.params;
            const { notes } = req.body;

            const order = await OrderService.updateOrderNotes(orderId, notes);

            if (!order) {
                throw new Error('Commande introuvable');
            }

            return order;
        },
    },
    // Récupérer les statistiques de vente (admin)
    {
        path: '/stats/sales',
        method: Method.GET,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const { startDate, endDate } = req.query;

            return await OrderService.getSalesStats(
                startDate ? new Date(startDate as string) : undefined,
                endDate ? new Date(endDate as string) : undefined,
            );
        },
    },
    // Valider ou refuser une commande (admin)
    {
        path: '/:orderId/validate',
        method: Method.POST,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const { orderId } = req.params;
            const request: ValidateOrderRequest = req.body;

            const order = await OrderService.validateOrder(orderId, request);

            if (!order) {
                throw new Error('Commande introuvable');
            }

            return order;
        },
    },
    // Créer un checkout SumUp pour une commande validée
    {
        path: '/:orderId/create-checkout',
        method: Method.POST,
        handler: async (req: Request) => {
            const { orderId } = req.params;
            const order = await OrderService.getOrderById(orderId);

            if (!order || order.status !== 'validated_awaiting_payment') {
                throw new Error('Commande non éligible au paiement');
            }

            if (order.paymentLinkExpiresAt && new Date() > new Date(order.paymentLinkExpiresAt)) {
                throw new Error('Lien de paiement expiré');
            }

            // Si un checkout existe déjà, le retourner
            if (order.checkoutId) {
                return { checkoutId: order.checkoutId };
            }

            // Créer un nouveau checkout SumUp
            const checkout = await SumUpService.createCheckout({
                amount: order.totalAmount,
                checkoutReference: order.orderNumber,
                description: `Commande ${order.orderNumber}`,
                returnUrl: `${process.env.FRONTEND_URL}/order-confirmation/${order.id}`,
            });

            // Stocker le checkoutId dans la commande
            await OrderService.updateCheckoutId(orderId, checkout.id);

            return { checkoutId: checkout.id };
        },
    },
];
