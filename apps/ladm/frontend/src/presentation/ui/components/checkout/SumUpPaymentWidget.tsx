import React, { useEffect, useRef, useState } from 'react';
import { loadSumUpSDK } from '../../../../utils/loadSumUpSDK';
import { SumUpCardInstance, SumUpResponseType, SumUpResponseBody } from '../../../../types/sumup';
import styles from './SumUpPaymentWidget.module.css';

interface SumUpPaymentWidgetProps {
    checkoutId: string;
    onSuccess: () => void;
    onCancel: () => void;
    onError: (error: string) => void;
}

export const SumUpPaymentWidget: React.FC<SumUpPaymentWidgetProps> = ({
    checkoutId,
    onSuccess,
    onCancel,
    onError,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const cardInstanceRef = useRef<SumUpCardInstance | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mounted = true;

        const initializeWidget = async () => {
            try {
                // Charger le SDK SumUp
                await loadSumUpSDK();

                if (!mounted) {
                    return;
                }

                // Vérifier que le container existe
                if (!containerRef.current) {
                    throw new Error('Container non trouvé');
                }

                // Monter le widget
                const cardInstance = window.SumUpCard.mount({
                    id: 'sumup-card-container',
                    checkoutId,
                    locale: 'fr-FR',
                    showSubmitButton: true,
                    onLoad: () => {
                        if (mounted) {
                            setIsLoading(false);
                            console.log('Widget SumUp chargé');
                        }
                    },
                    onResponse: (type: SumUpResponseType, body: SumUpResponseBody) => {
                        console.log('Réponse SumUp:', type, body);

                        switch (type) {
                            case 'sent':
                                // Le formulaire est envoyé au serveur
                                if (mounted) {
                                    setIsProcessing(true);
                                }
                                break;

                            case 'auth-screen':
                                // L'utilisateur est redirigé vers la page d'authentification (3D Secure)
                                console.log('Authentification 3D Secure en cours...');
                                break;

                            case 'success':
                                // Paiement réussi
                                if (mounted) {
                                    setIsProcessing(false);
                                    onSuccess();
                                }
                                break;

                            case 'fail':
                                // Paiement échoué ou annulé par l'utilisateur
                                if (mounted) {
                                    setIsProcessing(false);
                                    onError(
                                        body.message ||
                                            'Le paiement a échoué ou été annulé. Veuillez réessayer.',
                                    );
                                }
                                break;

                            case 'error':
                                // Erreur technique
                                if (mounted) {
                                    setIsProcessing(false);
                                    onError(
                                        body.error?.message ||
                                            'Une erreur est survenue lors du traitement du paiement.',
                                    );
                                }
                                break;

                            case 'invalid':
                                // Validation échouée
                                console.log('Validation échouée, vérifiez les champs');
                                break;

                            default:
                                console.log('Type de réponse non géré:', type);
                        }
                    },
                });

                if (mounted) {
                    cardInstanceRef.current = cardInstance;
                }
            } catch (error) {
                console.error('Erreur lors du chargement du widget SumUp:', error);
                if (mounted) {
                    setLoadError(
                        'Impossible de charger le système de paiement. Veuillez réessayer.',
                    );
                    setIsLoading(false);
                }
            }
        };

        initializeWidget();

        return () => {
            mounted = false;
            // Nettoyer le widget au démontage
            if (cardInstanceRef.current) {
                try {
                    cardInstanceRef.current.unmount();
                } catch (error) {
                    console.error('Erreur lors du démontage du widget:', error);
                }
            }
        };
    }, [checkoutId, onSuccess, onError]);

    const handleCancel = () => {
        if (!isProcessing) {
            onCancel();
        }
    };

    if (loadError) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>⚠️</div>
                <h3 className={styles.errorTitle}>Erreur de chargement</h3>
                <p className={styles.errorMessage}>{loadError}</p>
                <button onClick={onCancel} className={styles.cancelButton}>
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Paiement sécurisé</h2>
                <p className={styles.subtitle}>
                    Entrez vos informations de carte bancaire pour finaliser votre commande
                </p>
            </div>

            {isLoading && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                    <p className={styles.loaderText}>Chargement du système de paiement...</p>
                </div>
            )}

            <div
                id='sumup-card-container'
                ref={containerRef}
                className={styles.widgetContainer}
                style={{ display: isLoading ? 'none' : 'block' }}
            />

            {!isLoading && (
                <div className={styles.footer}>
                    <button
                        onClick={handleCancel}
                        className={styles.cancelButton}
                        disabled={isProcessing}
                    >
                        Annuler
                    </button>
                </div>
            )}

            {isProcessing && (
                <div className={styles.processingOverlay}>
                    <div className={styles.processingContent}>
                        <div className={styles.loader}></div>
                        <p className={styles.processingText}>Traitement du paiement en cours...</p>
                        <p className={styles.processingSubtext}>
                            Veuillez ne pas fermer cette page
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
