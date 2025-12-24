import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../../services/orderService';
import { paymentService } from '../../../services/paymentService';
import { SumUpPaymentWidget } from '../components/checkout/SumUpPaymentWidget';
import { Order } from '@monorepo/shared-types';
import styles from './OrderPaymentPage.module.css';

export const OrderPaymentPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [checkoutId, setCheckoutId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isInitializingRef = useRef(false);

    useEffect(() => {
        const initializePayment = async () => {
            if (isInitializingRef.current) {
                return;
            }
            isInitializingRef.current = true;

            if (!orderId) {
                setError('ID de commande manquant');
                setLoading(false);
                return;
            }

            try {
                // Récupérer la commande
                const fetchedOrder = await orderService.getOrderById(orderId);
                setOrder(fetchedOrder);

                if (fetchedOrder.status !== 'validated_awaiting_payment') {
                    setError("Cette commande n'est pas disponible pour le paiement");
                    setLoading(false);
                    return;
                }

                // Vérifier l'expiration
                if (fetchedOrder.paymentLinkExpiresAt) {
                    const expirationDate = new Date(fetchedOrder.paymentLinkExpiresAt);
                    const now = new Date();
                    if (now > expirationDate) {
                        setError('Le lien de paiement a expiré');
                        setLoading(false);
                        return;
                    }
                }

                // Créer le checkout SumUp
                const checkout = await orderService.createCheckoutForOrder(orderId);
                setCheckoutId(checkout.checkoutId);
                setLoading(false);
            } catch (err: any) {
                setError(
                    err.response?.data?.message ||
                        "Une erreur est survenue lors de l'initialisation du paiement",
                );
                setLoading(false);
            }
        };

        initializePayment();

        // Cleanup: réinitialiser la ref si le composant est démonté
        return () => {
            isInitializingRef.current = false;
        };
    }, [orderId]);

    const handlePaymentSuccess = async () => {
        if (!checkoutId || !orderId) {
            return;
        }

        try {
            // Vérifier le paiement côté serveur
            const isPaid = await paymentService.verifyPayment(checkoutId);

            if (isPaid) {
                // Rediriger vers la page de confirmation
                navigate(`/order-confirmation/${orderId}`);
            } else {
                setError(
                    "Le paiement n'a pas pu être vérifié. Veuillez contacter le support si le problème persiste.",
                );
            }
        } catch (err) {
            console.error('❌ [PAYMENT-PAGE] Erreur lors de la vérification du paiement:', err);
            setError(
                'Une erreur est survenue lors de la vérification du paiement. Veuillez contacter le support.',
            );
        }
    };

    const handlePaymentCancel = async () => {
        if (!orderId) {
            return;
        }

        if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
            try {
                // Annuler la commande et libérer les variantes
                await orderService.cancelOrder(orderId);

                // Rediriger vers la page d'accueil
                navigate('/ladm/');
            } catch (err) {
                setError("Une erreur est survenue lors de l'annulation. Veuillez réessayer.");
            }
        }
    };

    const handlePaymentError = (errorMessage: string) => {
        setError(errorMessage);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h1>Erreur</h1>
                    <p className={styles.errorMessage}>{error || 'Commande introuvable'}</p>
                    <button onClick={() => navigate('/ladm/')} className={styles.homeButton}>
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.paymentContainer}>
                <h1 className={styles.title}>Paiement de la commande</h1>

                <div className={styles.orderSummary}>
                    <p className={styles.orderNumber}>
                        <strong>Numéro de commande:</strong> {order.orderNumber}
                    </p>
                    <p className={styles.totalAmount}>
                        <strong>Montant total:</strong> {(order.totalAmount / 100).toFixed(2)} €
                    </p>
                    {order.shippingCost && (
                        <p className={styles.shippingCost}>
                            <em>
                                (dont {(order.shippingCost / 100).toFixed(2)} € de frais de
                                livraison)
                            </em>
                        </p>
                    )}
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                {checkoutId && (
                    <div className={styles.widgetContainer}>
                        <SumUpPaymentWidget
                            checkoutId={checkoutId}
                            onSuccess={handlePaymentSuccess}
                            onCancel={handlePaymentCancel}
                            onError={handlePaymentError}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
