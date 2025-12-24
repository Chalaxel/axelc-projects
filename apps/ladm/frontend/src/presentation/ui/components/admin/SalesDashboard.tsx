import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../../../services/orderService';
import { OrderStatus } from '@monorepo/shared-types';
import styles from './SalesDashboard.module.css';

export const SalesDashboard = () => {
    const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | '90days'>('30days');

    const getDateRange = (): { startDate?: Date; endDate?: Date } => {
        const endDate = new Date();
        let startDate: Date | undefined = undefined;

        switch (dateRange) {
            case '7days':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30days':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90days':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 90);
                break;
            case 'all':
            default:
                break;
        }

        return startDate ? { startDate, endDate } : { endDate };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['salesStats', dateRange],
        queryFn: () => {
            const { startDate, endDate } = getDateRange();
            return orderService.getSalesStats(startDate, endDate);
        },
    });

    if (isLoading) {
        return <div className={styles.loading}>Chargement des statistiques...</div>;
    }

    const stats = data || {
        totalRevenue: 0,
        totalOrders: 0,
        ordersByStatus: {} as Record<OrderStatus, number>,
        recentOrders: [],
    };

    const getStatusText = (status: OrderStatus) => {
        const statusMap: Record<OrderStatus, string> = {
            pending_validation: 'En attente de validation',
            validated_awaiting_payment: 'Validées - En attente de paiement',
            pending: 'En attente',
            paid: 'Payées',
            preparing: 'En préparation',
            shipped: 'Expédiées',
            delivered: 'Livrées',
            cancelled: 'Annulées',
        };
        return statusMap[status] || status;
    };

    const exportToCSV = () => {
        if (!stats.recentOrders || stats.recentOrders.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }

        const headers = [
            'Numéro de commande',
            'Date',
            'Statut',
            'Montant (€)',
            'Client',
            'Articles',
        ];
        const rows = stats.recentOrders.map(order => [
            order.orderNumber,
            new Date(order.createdAt).toLocaleDateString('fr-FR'),
            getStatusText(order.status),
            (order.totalAmount / 100).toFixed(2),
            `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
            order.items?.length || 0,
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ventes_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Tableau de bord des ventes</h2>
                <div className={styles.controls}>
                    <select
                        value={dateRange}
                        onChange={e =>
                            setDateRange(e.target.value as 'all' | '7days' | '30days' | '90days')
                        }
                        className={styles.select}
                    >
                        <option value='7days'>7 derniers jours</option>
                        <option value='30days'>30 derniers jours</option>
                        <option value='90days'>90 derniers jours</option>
                        <option value='all'>Toutes les périodes</option>
                    </select>
                    <button onClick={exportToCSV} className={styles.exportButton}>
                        Exporter CSV
                    </button>
                </div>
            </div>

            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>€</div>
                    <div className={styles.metricContent}>
                        <h3 className={styles.metricLabel}>Chiffre d'affaires</h3>
                        <p className={styles.metricValue}>
                            {(stats.totalRevenue / 100).toFixed(2)} €
                        </p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>📦</div>
                    <div className={styles.metricContent}>
                        <h3 className={styles.metricLabel}>Total commandes</h3>
                        <p className={styles.metricValue}>{stats.totalOrders}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>💰</div>
                    <div className={styles.metricContent}>
                        <h3 className={styles.metricLabel}>Panier moyen</h3>
                        <p className={styles.metricValue}>
                            {stats.totalOrders > 0
                                ? (stats.totalRevenue / stats.totalOrders / 100).toFixed(2)
                                : '0.00'}{' '}
                            €
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.statusSection}>
                <h3 className={styles.sectionTitle}>Commandes par statut</h3>
                <div className={styles.statusGrid}>
                    {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                        <div key={status} className={styles.statusCard}>
                            <div className={styles.statusLabel}>
                                {getStatusText(status as OrderStatus)}
                            </div>
                            <div className={styles.statusCount}>{count}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.recentSection}>
                <h3 className={styles.sectionTitle}>Commandes récentes</h3>
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className={styles.ordersTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Numéro</th>
                                    <th>Date</th>
                                    <th>Client</th>
                                    <th>Montant</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.orderNumber}</td>
                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td>
                                            {order.shippingInfo.firstName}{' '}
                                            {order.shippingInfo.lastName}
                                        </td>
                                        <td>{(order.totalAmount / 100).toFixed(2)} €</td>
                                        <td>
                                            <span
                                                className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}
                                            >
                                                {getStatusText(order.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.empty}>Aucune commande récente</div>
                )}
            </div>
        </div>
    );
};
