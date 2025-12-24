import { Order, CreateOrderRequest, OrderStatus, ValidateOrderRequest } from '@monorepo/shared-types';
import api from './api';

export const orderService = {
    // Créer une nouvelle commande
    async createOrder(orderRequest: CreateOrderRequest): Promise<Order> {
        const response = await api.post('/orders', orderRequest);
        return response.data;
    },

    // Récupérer une commande par ID
    async getOrderById(orderId: string): Promise<Order> {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },

    // Récupérer toutes les commandes (admin)
    async getOrders(
        status?: OrderStatus,
        limit = 50,
        offset = 0,
    ): Promise<{ orders: Order[]; total: number }> {
        const params = new URLSearchParams();
        if (status) {
            params.append('status', status);
        }
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());

        const response = await api.get(`/orders?${params.toString()}`);
        return response.data;
    },

    // Mettre à jour le statut d'une commande (admin)
    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
        const response = await api.patch(`/orders/${orderId}/status`, {
            status,
        });
        return response.data;
    },

    // Mettre à jour les informations de livraison (admin)
    async updateShippingInfo(orderId: string, shippingUpdate: any): Promise<Order> {
        const response = await api.patch(`/orders/${orderId}/shipping`, shippingUpdate);
        return response.data;
    },

    // Mettre à jour les notes (admin)
    async updateOrderNotes(orderId: string, notes: string): Promise<Order> {
        const response = await api.patch(`/orders/${orderId}/notes`, {
            notes,
        });
        return response.data;
    },

    // Annuler une commande (avec motif optionnel)
    async cancelOrder(orderId: string, reason?: string): Promise<Order> {
        const response = await api.post(`/orders/${orderId}/cancel`, { reason });
        return response.data;
    },

    // Récupérer les statistiques de vente (admin)
    async getSalesStats(
        startDate?: Date,
        endDate?: Date,
    ): Promise<{
        totalRevenue: number;
        totalOrders: number;
        ordersByStatus: Record<OrderStatus, number>;
        recentOrders: Order[];
    }> {
        const params = new URLSearchParams();
        if (startDate) {
            params.append('startDate', startDate.toISOString());
        }
        if (endDate) {
            params.append('endDate', endDate.toISOString());
        }

        const response = await api.get(`/orders/stats/sales?${params.toString()}`);
        return response.data;
    },

    // Valider ou refuser une commande (admin)
    async validateOrder(orderId: string, request: ValidateOrderRequest): Promise<Order> {
        const response = await api.post(`/orders/${orderId}/validate`, request);
        return response.data;
    },

    // Créer un checkout SumUp pour une commande validée
    async createCheckoutForOrder(orderId: string): Promise<{ checkoutId: string }> {
        const response = await api.post(`/orders/${orderId}/create-checkout`);
        return response.data;
    },
};
