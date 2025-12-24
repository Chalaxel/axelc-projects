import { Request } from 'express';
import { Route, Method } from '../types';
import { SumUpService } from '../services/SumUpService';
import { OrderService } from '../services/OrderService';

export const paymentsRoutes: Route[] = [
    // Créer un checkout SumUp
    {
        path: '/sumup/checkout',
        method: Method.POST,
        handler: async (req: Request) => {
            const { amount, checkoutReference, description, returnUrl } = req.body;

            const checkout = await SumUpService.createCheckout({
                amount,
                checkoutReference,
                description,
                returnUrl,
            });

            return {
                checkoutId: checkout.id,
                ...checkout,
            };
        },
    },
    // Vérifier le statut d'un paiement
    {
        path: '/sumup/verify/:checkoutId',
        method: Method.GET,
        handler: async (req: Request) => {
            const { checkoutId } = req.params;

            const isPaid = await SumUpService.verifyPayment(checkoutId);

            // Si le paiement est confirmé, on doit mettre à jour la commande
            if (isPaid) {
                // Trouver la commande avec ce checkoutId
                const { orders } = await OrderService.getOrders(undefined, 100, 0);
                const order = orders.find((o) => o.checkoutId === checkoutId);

                if (order) {
                    if (order.status === 'validated_awaiting_payment') {
                        await OrderService.updateOrderStatus(order.id, 'paid');
                    }
                }
            }

            return { isPaid };
        },
    },
    // Webhook SumUp (callback après paiement)
    {
        path: '/sumup/webhook',
        method: Method.POST,
        handler: async (req: Request) => {
            const { status, checkout_reference } = req.body;

            // Si le paiement est confirmé, mettre à jour le statut de la commande
            if (status === 'PAID' && checkout_reference) {
                // Trouver la commande par orderNumber (utilisé comme checkout_reference)
                const { orders } = await OrderService.getOrders(undefined, 100, 0);
                const order = orders.find((o) => o.orderNumber === checkout_reference);

                if (order) {
                    if (['pending', 'validated_awaiting_payment'].includes(order.status)) {
                        await OrderService.updateOrderStatus(order.id, 'paid');
                    }
                }
            }

            return { success: true };
        },
    },
    // Enregistrer un paiement physique (terminal SumUp)
    {
        path: '/sumup/physical',
        method: Method.POST,
        handler: async (req: Request) => {
            const { orderNumber, amount, terminalId } = req.body;

            const result = await SumUpService.recordPhysicalPayment(
                orderNumber,
                amount,
                terminalId,
            );

            return result;
        },
    },
];
