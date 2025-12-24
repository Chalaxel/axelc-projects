import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../../services/orderService';
import { Order } from '@monorepo/shared-types';
import styles from './OrderConfirmationPage.module.css';

export const OrderConfirmationPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('ID de commande manquant');
                setLoading(false);
                return;
            }

            try {
                const fetchedOrder = await orderService.getOrderById(orderId);
                setOrder(fetchedOrder);
            } catch (err) {
                console.error('Erreur lors de la récupération de la commande:', err);
                setError('Impossible de récupérer les détails de la commande');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Chargement...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h1>Erreur</h1>
                    <p>{error || 'Commande introuvable'}</p>
                    <Link to='/ladm/products' className={styles.button}>
                        Retour aux produits
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending_validation':
                return 'En attente de validation';
            case 'validated_awaiting_payment':
                return 'Validée - En attente de paiement';
            case 'pending':
                return 'En attente de paiement';
            case 'paid':
                return 'Payée';
            case 'preparing':
                return 'En préparation';
            case 'shipped':
                return 'Expédiée';
            case 'delivered':
                return 'Livrée';
            case 'cancelled':
                return 'Annulée';
            default:
                return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'paid':
            case 'delivered':
                return styles.statusSuccess;
            case 'pending':
                return styles.statusPending;
            case 'cancelled':
                return styles.statusError;
            default:
                return styles.statusDefault;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.confirmation}>
                <div className={styles.successIcon}>✓</div>
                <h1 className={styles.title}>Commande confirmée !</h1>
                <p className={styles.subtitle}>Merci pour votre achat</p>

                <div className={styles.orderInfo}>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Numéro de commande:</span>
                        <span className={styles.value}>{order.orderNumber}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Statut:</span>
                        <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                        </span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Montant total:</span>
                        <span className={styles.value}>
                            {(order.totalAmount / 100).toFixed(2)} €
                        </span>
                    </div>
                </div>

                <div className={styles.shippingInfo}>
                    <h2 className={styles.sectionTitle}>Adresse de livraison</h2>
                    <p>
                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                    </p>
                    <p>{order.shippingInfo.address}</p>
                    <p>
                        {order.shippingInfo.postalCode} {order.shippingInfo.city}
                    </p>
                    <p>{order.shippingInfo.country}</p>
                </div>

                {order.items && order.items.length > 0 && (
                    <div className={styles.items}>
                        <h2 className={styles.sectionTitle}>Articles commandés</h2>
                        {order.items.map(item => (
                            <div key={item.id} className={styles.item}>
                                {item.variant?.imageBase64 && (
                                    <img
                                        src={item.variant.imageBase64}
                                        alt={item.variant?.name || 'Variante'}
                                        className={styles.itemImage}
                                    />
                                )}
                                <div className={styles.itemInfo}>
                                    <h3 className={styles.itemName}>
                                        {item.product?.name || 'Produit'}
                                    </h3>
                                    <p className={styles.itemVariant}>
                                        {item.variant?.name || 'Variante'}
                                    </p>
                                    <p className={styles.itemQuantity}>Quantité: {item.quantity}</p>
                                </div>
                                <div className={styles.itemPrice}>
                                    {((item.price * item.quantity) / 100).toFixed(2)} €
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.message}>
                    {order.status === 'pending_validation' ? (
                        <>
                            <div className={styles.pendingMessage}>
                                <div className={styles.pendingIcon}>⏳</div>
                                <h3>Demande de commande reçue !</h3>
                                <p>
                                    Votre demande de commande a bien été enregistrée et est en cours
                                    de traitement par notre équipe.
                                </p>
                            </div>

                            <div className={styles.emailNotification}>
                                <p>📧 Un email de confirmation vous a été envoyé à l'adresse :</p>
                                <p className={styles.email}>{order.shippingInfo.email}</p>
                                <p className={styles.followUp}>
                                    Vous recevrez un email avec le montant total (incluant les frais
                                    de livraison) et un lien de paiement dans les 48 heures.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.successMessage}>
                                <div className={styles.checkIcon}>✓</div>
                                <h3>Paiement validé avec succès !</h3>
                                <p>
                                    Votre transaction a bien été effectuée et votre commande est
                                    confirmée.
                                </p>
                            </div>

                            <div className={styles.emailNotification}>
                                <p>📧 Un email de confirmation vous a été envoyé à l'adresse :</p>
                                <p className={styles.email}>{order.shippingInfo.email}</p>
                                <p className={styles.followUp}>
                                    Vous recevrez également un email de suivi lorsque votre commande
                                    sera expédiée.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.actions}>
                    <Link to='/ladm/products' className={styles.button}>
                        Continuer vos achats
                    </Link>
                </div>
            </div>
        </div>
    );
};
