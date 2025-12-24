import axios from 'axios';

interface SumUpCheckoutResponse {
    id: string;
    checkout_reference: string;
    amount: number;
    currency: string;
    status: string;
    date: string;
}

interface CreateCheckoutParams {
    amount: number; // Montant en centimes
    currency?: string;
    checkoutReference: string; // Référence unique (ex: orderNumber)
    description?: string;
    returnUrl?: string;
}

export class SumUpService {
    private static readonly API_BASE_URL = 'https://api.sumup.com/v0.1';
    private static readonly API_KEY = process.env.SUMUP_API_KEY;
    private static readonly MERCHANT_CODE = process.env.SUMUP_MERCHANT_CODE;

    // Créer un checkout SumUp pour paiement en ligne
    static async createCheckout(params: CreateCheckoutParams): Promise<SumUpCheckoutResponse> {
        if (!this.API_KEY) {
            throw new Error('SumUp API key not configured');
        }

        if (!this.MERCHANT_CODE) {
            throw new Error('SumUp merchant code not configured');
        }

        try {
            const payload = {
                checkout_reference: params.checkoutReference,
                amount: params.amount / 100, // SumUp attend le montant en unité principale (euros)
                currency: params.currency || 'EUR',
                merchant_code: this.MERCHANT_CODE,
                description: params.description || `Commande ${params.checkoutReference}`,
                ...(params.returnUrl && { return_url: params.returnUrl }),
            };

            const response = await axios.post(`${this.API_BASE_URL}/checkouts`, payload, {
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error: any) {
            if (error.response?.data?.error_code === 'DUPLICATED_CHECKOUT') {
                const existingCheckout = await this.getCheckoutByReference(
                    params.checkoutReference,
                );
                if (existingCheckout) {
                    return existingCheckout;
                }
            }

            if (error.response?.data) {
                throw new Error(`SumUp API Error: ${JSON.stringify(error.response.data)}`);
            }

            throw new Error('Impossible de créer le checkout SumUp');
        }
    }

    // Récupérer les détails d'un checkout
    static async getCheckout(checkoutId: string): Promise<SumUpCheckoutResponse> {
        if (!this.API_KEY) {
            throw new Error('SumUp API key not configured');
        }

        try {
            const response = await axios.get(`${this.API_BASE_URL}/checkouts/${checkoutId}`, {
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                },
            });

            return response.data;
        } catch (error: any) {
            throw new Error(
                `Impossible de récupérer le checkout SumUp: ${error.response?.status || 'Unknown error'}`,
            );
        }
    }

    // Récupérer un checkout par sa référence (orderNumber)
    static async getCheckoutByReference(
        checkoutReference: string,
    ): Promise<SumUpCheckoutResponse | null> {
        if (!this.API_KEY || !this.MERCHANT_CODE) {
            throw new Error('SumUp API credentials not configured');
        }

        try {
            // L'API SumUp permet de lister les checkouts avec un filtre
            const response = await axios.get(`${this.API_BASE_URL}/checkouts`, {
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                },
                params: {
                    checkout_reference: checkoutReference,
                },
            });

            const checkouts = response.data.items || response.data || [];
            if (Array.isArray(checkouts) && checkouts.length > 0) {
                return checkouts[0];
            }

            return null;
        } catch (error: any) {
            return null;
        }
    }

    // Vérifier le statut d'un paiement
    static async verifyPayment(checkoutId: string): Promise<boolean> {
        try {
            const checkout = await this.getCheckout(checkoutId);
            return checkout.status === 'PAID';
        } catch (error) {
            console.error('Erreur lors de la vérification du paiement:', error);
            return false;
        }
    }

    // Générer l'URL de paiement pour le client
    static getCheckoutUrl(checkoutId: string): string {
        return `https://pay.sumup.com/checkout/${checkoutId}`;
    }

    // Pour les paiements physiques avec le terminal SumUp,
    // le vendeur validera manuellement la commande dans le back-office
    // Cette méthode peut être étendue si SumUp propose une API pour les terminaux
    static async recordPhysicalPayment(
        orderNumber: string,
        amount: number,
        terminalId?: string,
    ): Promise<{ success: boolean; transactionId: string }> {
        // Pour l'instant, on génère juste un ID de transaction local
        // Dans un vrai système, on pourrait intégrer l'API des terminaux SumUp si disponible
        const transactionId = `PHYSICAL-${orderNumber}-${Date.now()}`;

        console.log(`Paiement physique enregistré: ${transactionId} pour ${amount / 100}€`);

        return {
            success: true,
            transactionId,
        };
    }
}
