import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../../../services/notificationService';
import { Notification } from '@monorepo/shared-types';
import styles from './NotificationCenter.module.css';

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Récupérer le nombre de notifications non lues
    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['notificationsCount'],
        queryFn: notificationService.countUnread,
        refetchInterval: 30000, // Actualiser toutes les 30 secondes
    });

    // Récupérer toutes les notifications
    const { data: notifications = [] } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: () => notificationService.getAllNotifications(20, 0),
        enabled: isOpen, // Ne charger que quand le dropdown est ouvert
    });

    const markAsReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notificationsCount'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notificationsCount'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    // Fermer le dropdown quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsReadMutation.mutate(notification.id);
        }
    };

    const handleMarkAllRead = () => {
        markAllAsReadMutation.mutate();
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'new_order':
                return '🛒';
            case 'payment_received':
                return '💰';
            case 'order_cancelled':
                return '❌';
            default:
                return '📬';
        }
    };

    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "À l'instant";
        if (minutes < 60) return `Il y a ${minutes} min`;
        if (hours < 24) return `Il y a ${hours}h`;
        return `Il y a ${days}j`;
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button className={styles.bell} onClick={() => setIsOpen(!isOpen)}>
                🔔
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className={styles.markAllRead}>
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    <div className={styles.list}>
                        {notifications.length === 0 ? (
                            <div className={styles.empty}>Aucune notification</div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`${styles.notification} ${!notification.isRead ? styles.unread : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className={styles.icon}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className={styles.content}>
                                        <h4 className={styles.notificationTitle}>
                                            {notification.title}
                                        </h4>
                                        <p className={styles.message}>{notification.message}</p>
                                        <span className={styles.time}>
                                            {getTimeAgo(notification.createdAt)}
                                        </span>
                                    </div>
                                    {!notification.isRead && (
                                        <div className={styles.unreadDot} />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

