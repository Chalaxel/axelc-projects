import api from './api';

export const paymentService = {
    // Créer un checkout SumUp
    async createSumUpCheckout(params: {
        amount: number;
        checkoutReference: string;
        description?: string;
        returnUrl?: string;
    }): Promise<{ checkoutId: string }> {
        const response = await api.post(`/payments/sumup/checkout`, params);
        return response.data;
    },

    // Vérifier le statut d'un paiement
    async verifyPayment(checkoutId: string): Promise<boolean> {
        const response = await api.get(`/payments/sumup/verify/${checkoutId}`);
        return response.data.isPaid;
    },

    // Enregistrer un paiement physique
    async recordPhysicalPayment(params: {
        orderNumber: string;
        amount: number;
        terminalId?: string;
    }): Promise<{ success: boolean; transactionId: string }> {
        const response = await api.post(`/payments/sumup/physical`, params);
        return response.data;
    },
};
