import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderStatus } from '@monorepo/shared-types';
import { orderService } from '../../../../services/orderService';
import styles from './OrdersManagement.module.css';

export const OrdersManagement = () => {
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [shippingUpdate, setShippingUpdate] = useState({ trackingNumber: '', carrier: '' });
    const [notesUpdate, setNotesUpdate] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery<{ orders: Order[]; total: number }>({
        queryKey: ['orders', filterStatus],
        queryFn: () =>
            orderService.getOrders(filterStatus === 'all' ? undefined : filterStatus, 100, 0),
    });

    const updateShippingMutation = useMutation({
        mutationFn: ({ orderId, update }: { orderId: string; update: any }) =>
            orderService.updateShippingInfo(orderId, update),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setShippingUpdate({ trackingNumber: '', carrier: '' });
        },
    });

    const updateNotesMutation = useMutation({
        mutationFn: ({ orderId, notes }: { orderId: string; notes: string }) =>
            orderService.updateOrderNotes(orderId, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setNotesUpdate('');
        },
    });

    const validateOrderMutation = useMutation({
        mutationFn: ({ orderId, shippingCost }: { orderId: string; shippingCost: number }) =>
            orderService.validateOrder(orderId, { approved: true, shippingCost }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setSelectedOrder(null);
            setShippingCost(0);
        },
    });

    const cancelOrderMutation = useMutation({
        mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
            orderService.cancelOrder(orderId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setSelectedOrder(null);
            setShowCancelModal(false);
            setCancellationReason('');
        },
    });

    const getStatusBadgeClass = (status: OrderStatus) => {
        switch (status) {
            case 'paid':
            case 'delivered':
                return styles.statusSuccess;
            case 'pending':
                return styles.statusPending;
            case 'preparing':
            case 'shipped':
                return styles.statusInfo;
            case 'cancelled':
                return styles.statusError;
            default:
                return styles.statusDefault;
        }
    };

    const getStatusText = (status: OrderStatus) => {
        const statusMap: Record<OrderStatus, string> = {
            pending_validation: 'En attente de validation',
            validated_awaiting_payment: 'Validée - En attente de paiement',
            pending: 'En attente',
            paid: 'Payée',
            preparing: 'En préparation',
            shipped: 'Expédiée',
            delivered: 'Livrée',
            cancelled: 'Annulée',
        };
        return statusMap[status] || status;
    };

    const handleValidateOrder = () => {
        if (selectedOrder) {
            if (
                window.confirm(
                    'Confirmer cette commande et envoyer le lien de paiement au client ?',
                )
            ) {
                validateOrderMutation.mutate({
                    orderId: selectedOrder.id,
                    shippingCost: Math.round(shippingCost * 100), // Convert to cents
                });
            }
        }
    };

    const handleCancelOrder = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancellation = () => {
        if (selectedOrder) {
            const mutationData: { orderId: string; reason?: string } = {
                orderId: selectedOrder.id,
            };
            if (cancellationReason) {
                mutationData.reason = cancellationReason;
            }
            cancelOrderMutation.mutate(mutationData);
        }
    };

    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setCancellationReason('');
    };

    const handleShippingUpdate = () => {
        if (selectedOrder && (shippingUpdate.trackingNumber || shippingUpdate.carrier)) {
            updateShippingMutation.mutate({
                orderId: selectedOrder.id,
                update: shippingUpdate,
            });
        }
    };

    const handleNotesUpdate = () => {
        if (selectedOrder && notesUpdate) {
            updateNotesMutation.mutate({
                orderId: selectedOrder.id,
                notes: notesUpdate,
            });
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Chargement des commandes...</div>;
    }

    const orders = data?.orders || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Gestion des commandes</h2>
                <div className={styles.filters}>
                    <label>Filtrer par statut:</label>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as OrderStatus | 'all')}
                        className={styles.select}
                    >
                        <option value='all'>Toutes</option>
                        <option value='pending'>En attente</option>
                        <option value='paid'>Payées</option>
                        <option value='preparing'>En préparation</option>
                        <option value='shipped'>Expédiées</option>
                        <option value='delivered'>Livrées</option>
                        <option value='cancelled'>Annulées</option>
                    </select>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className={styles.empty}>Aucune commande trouvée</div>
            ) : (
                <div className={styles.ordersGrid}>
                    {orders.map(order => (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div>
                                    <h3 className={styles.orderNumber}>{order.orderNumber}</h3>
                                    <p className={styles.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                    {order.shippingInfo.relayPoint && (
                                        <span className={styles.deliveryBadge}>
                                            📍 Point Relais
                                        </span>
                                    )}
                                </div>
                                <span
                                    className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}
                                >
                                    {getStatusText(order.status)}
                                </span>
                            </div>

                            <div className={styles.orderDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Montant:</span>
                                    <span className={styles.detailValue}>
                                        {(order.totalAmount / 100).toFixed(2)} €
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Client:</span>
                                    <span className={styles.detailValue}>
                                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Articles:</span>
                                    <span className={styles.detailValue}>
                                        {order.items?.length || 0}
                                    </span>
                                </div>
                                {order.shippingInfo.relayPoint && (
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Point Relais:</span>
                                        <span className={styles.detailValue}>
                                            {order.shippingInfo.relayPoint.name}
                                        </span>
                                    </div>
                                )}
                                {order.shippingInfo.trackingNumber && (
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Suivi:</span>
                                        <span className={styles.detailValue}>
                                            {order.shippingInfo.trackingNumber}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.actions}>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className={styles.viewButton}
                                >
                                    Voir le détail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedOrder && (
                <div className={styles.modal} onClick={() => setSelectedOrder(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setSelectedOrder(null)}
                        >
                            ×
                        </button>

                        <h2 className={styles.modalTitle}>Commande {selectedOrder.orderNumber}</h2>
                        <div
                            className={`${styles.statusBadge} ${getStatusBadgeClass(selectedOrder.status)}`}
                        >
                            {getStatusText(selectedOrder.status)}
                        </div>

                        <div className={styles.modalSection}>
                            <h3 className={styles.sectionTitle}>Informations client</h3>
                            <p>
                                {selectedOrder.shippingInfo.firstName}{' '}
                                {selectedOrder.shippingInfo.lastName}
                            </p>
                            <p>{selectedOrder.shippingInfo.email}</p>
                            <p>{selectedOrder.shippingInfo.phone}</p>
                        </div>

                        {selectedOrder.shippingInfo.relayPoint ? (
                            <div className={styles.modalSection}>
                                <h3 className={styles.sectionTitle}>
                                    <span className={styles.relayIcon}>📍</span>
                                    Point Relais Mondial Relay
                                </h3>
                                <div className={styles.relayPointCard}>
                                    <p className={styles.relayPointId}>
                                        ID: {selectedOrder.shippingInfo.relayPoint.id}
                                    </p>
                                    <p className={styles.relayPointName}>
                                        {selectedOrder.shippingInfo.relayPoint.name}
                                    </p>
                                    <p>{selectedOrder.shippingInfo.relayPoint.address}</p>
                                    <p>
                                        {selectedOrder.shippingInfo.relayPoint.postalCode}{' '}
                                        {selectedOrder.shippingInfo.relayPoint.city}
                                    </p>
                                    <p>{selectedOrder.shippingInfo.relayPoint.country}</p>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.modalSection}>
                                <h3 className={styles.sectionTitle}>Adresse de livraison</h3>
                                <p>{selectedOrder.shippingInfo.address}</p>
                                <p>
                                    {selectedOrder.shippingInfo.postalCode}{' '}
                                    {selectedOrder.shippingInfo.city}
                                </p>
                                <p>{selectedOrder.shippingInfo.country}</p>
                            </div>
                        )}

                        <div className={styles.modalSection}>
                            <h3 className={styles.sectionTitle}>Articles commandés</h3>
                            {selectedOrder.items?.map(item => (
                                <div key={item.id} className={styles.modalItem}>
                                    <div>
                                        <strong>{item.product?.name || 'Produit'}</strong> -{' '}
                                        {item.variant?.name || 'Variante'}
                                        <br />
                                        Quantité: {item.quantity}
                                    </div>
                                    <div>{((item.price * item.quantity) / 100).toFixed(2)} €</div>
                                </div>
                            ))}
                            <div className={styles.modalSubtotal}>
                                Sous-total produits:{' '}
                                {(
                                    (selectedOrder.totalAmount -
                                        (selectedOrder.shippingCost || 0)) /
                                    100
                                ).toFixed(2)}{' '}
                                €
                            </div>
                        </div>

                        {selectedOrder.status === 'pending_validation' ? (
                            <>
                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}>Frais de livraison</h3>
                                    <div className={styles.shippingCostInput}>
                                        <label htmlFor='shipping-cost'>
                                            Montant des frais de livraison (€):
                                        </label>
                                        <input
                                            id='shipping-cost'
                                            type='number'
                                            min='0'
                                            step='0.01'
                                            placeholder='0.00'
                                            value={shippingCost}
                                            onChange={e =>
                                                setShippingCost(parseFloat(e.target.value) || 0)
                                            }
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.totalWithShipping}>
                                        <strong>Total avec livraison:</strong>
                                        <strong>
                                            {(
                                                (selectedOrder.totalAmount -
                                                    (selectedOrder.shippingCost || 0)) /
                                                    100 +
                                                shippingCost
                                            ).toFixed(2)}{' '}
                                            €
                                        </strong>
                                    </div>
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        onClick={handleCancelOrder}
                                        className={styles.cancelButton}
                                        disabled={cancelOrderMutation.isPending}
                                    >
                                        {cancelOrderMutation.isPending
                                            ? 'Annulation...'
                                            : 'Annuler la commande'}
                                    </button>
                                    <button
                                        onClick={handleValidateOrder}
                                        className={styles.confirmButton}
                                        disabled={validateOrderMutation.isPending}
                                    >
                                        {validateOrderMutation.isPending
                                            ? 'Confirmation...'
                                            : 'Confirmer la commande'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}>Montants</h3>
                                    {selectedOrder.shippingCost &&
                                        selectedOrder.shippingCost > 0 && (
                                            <p>
                                                Frais de livraison:{' '}
                                                {(selectedOrder.shippingCost / 100).toFixed(2)} €
                                            </p>
                                        )}
                                    <div className={styles.modalTotal}>
                                        Total: {(selectedOrder.totalAmount / 100).toFixed(2)} €
                                    </div>
                                </div>

                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}>
                                        Informations de livraison
                                    </h3>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type='text'
                                            placeholder='Numéro de suivi'
                                            value={shippingUpdate.trackingNumber}
                                            onChange={e =>
                                                setShippingUpdate(prev => ({
                                                    ...prev,
                                                    trackingNumber: e.target.value,
                                                }))
                                            }
                                            className={styles.input}
                                        />
                                        <input
                                            type='text'
                                            placeholder='Transporteur'
                                            value={shippingUpdate.carrier}
                                            onChange={e =>
                                                setShippingUpdate(prev => ({
                                                    ...prev,
                                                    carrier: e.target.value,
                                                }))
                                            }
                                            className={styles.input}
                                        />
                                        <button
                                            onClick={handleShippingUpdate}
                                            className={styles.saveButton}
                                        >
                                            Enregistrer
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}>Notes internes</h3>
                                    {selectedOrder.notes && (
                                        <p className={styles.existingNotes}>
                                            {selectedOrder.notes}
                                        </p>
                                    )}
                                    <textarea
                                        placeholder='Ajouter une note...'
                                        value={notesUpdate}
                                        onChange={e => setNotesUpdate(e.target.value)}
                                        className={styles.textarea}
                                        rows={4}
                                    />
                                    <button
                                        onClick={handleNotesUpdate}
                                        className={styles.saveButton}
                                    >
                                        Enregistrer note
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showCancelModal && selectedOrder && (
                <div className={styles.modal} onClick={handleCloseCancelModal}>
                    <div className={styles.cancelModal} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={handleCloseCancelModal}>
                            ×
                        </button>

                        <h2 className={styles.cancelModalTitle}>Annuler la commande</h2>
                        <p className={styles.cancelModalSubtitle}>
                            Commande {selectedOrder.orderNumber}
                        </p>

                        <div className={styles.cancelModalContent}>
                            <label htmlFor='cancellation-reason' className={styles.cancelLabel}>
                                Motif d'annulation (sera envoyé au client par email) :
                            </label>
                            <textarea
                                id='cancellation-reason'
                                className={styles.cancelTextarea}
                                placeholder="Saisissez le motif d'annulation..."
                                value={cancellationReason}
                                onChange={e => setCancellationReason(e.target.value)}
                                rows={4}
                            />
                            <p className={styles.cancelHint}>
                                Un email sera envoyé au client avec ce motif d'annulation.
                            </p>
                        </div>

                        <div className={styles.cancelModalActions}>
                            <button
                                onClick={handleCloseCancelModal}
                                className={styles.cancelModalSecondary}
                            >
                                Retour
                            </button>
                            <button
                                onClick={handleConfirmCancellation}
                                className={styles.cancelModalPrimary}
                                disabled={cancelOrderMutation.isPending}
                            >
                                {cancelOrderMutation.isPending
                                    ? 'Annulation en cours...'
                                    : "Confirmer l'annulation"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
