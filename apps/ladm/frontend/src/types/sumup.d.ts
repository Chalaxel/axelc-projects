// Types pour le SDK SumUp Payment Widget
// Documentation: https://developer.sumup.com/online-payments/checkouts/card-widget

export type SumUpResponseType = 'sent' | 'invalid' | 'auth-screen' | 'error' | 'success' | 'fail';

export interface SumUpResponseBody {
    // Pour le type 'sent'
    last_four_digits?: string;
    card_scheme?: string;

    // Pour le type 'error'
    error?: {
        message: string;
        code?: string;
    };

    // Pour le type 'success' ou 'fail'
    checkout_id?: string;
    status?: string;
    message?: string;
    transaction_id?: string;
    transaction_code?: string;
}

export interface SumUpCardConfig {
    checkoutId: string;
    onResponse?: (type: SumUpResponseType, body: SumUpResponseBody) => void;
    onLoad?: () => void;
    locale?: string;
    country?: string;
    showSubmitButton?: boolean;
    showEmail?: boolean;
    showZipCode?: boolean;
    showInstallments?: boolean;
    email?: string;
    amount?: number;
    currency?: string;
    id?: string;
}

export interface SumUpCardInstance {
    submit: () => void;
    unmount: () => void;
    update: (config: Partial<SumUpCardConfig>) => void;
}

declare global {
    interface Window {
        SumUpCard: {
            mount: (config: SumUpCardConfig) => SumUpCardInstance;
        };
    }
}

export {};
