import { models } from '../models/models';
import { Notification, NotificationCreationAttributes, NotificationType } from '@monorepo/shared-types';

export class NotificationService {
    // Créer une nouvelle notification
    static async createNotification(
        notificationData: NotificationCreationAttributes,
    ): Promise<Notification> {
        try {
            const notification = await models.notification.create(notificationData);
            return notification.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la création de la notification:', error);
            throw new Error('Impossible de créer la notification');
        }
    }

    // Récupérer toutes les notifications non lues
    static async getUnreadNotifications(): Promise<Notification[]> {
        try {
            const notifications = await models.notification.findAll({
                where: { isRead: false },
                order: [['createdAt', 'DESC']],
                raw: true,
            });
            return notifications;
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
            throw new Error('Impossible de récupérer les notifications');
        }
    }

    // Récupérer toutes les notifications (avec pagination optionnelle)
    static async getAllNotifications(limit = 50, offset = 0): Promise<Notification[]> {
        try {
            const notifications = await models.notification.findAll({
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                raw: true,
            });
            return notifications;
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
            throw new Error('Impossible de récupérer les notifications');
        }
    }

    // Marquer une notification comme lue
    static async markAsRead(notificationId: string): Promise<Notification | null> {
        try {
            const notification = await models.notification.findByPk(notificationId);

            if (!notification) {
                return null;
            }

            await notification.update({ isRead: true });
            return notification.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la notification:', error);
            throw new Error('Impossible de mettre à jour la notification');
        }
    }

    // Marquer toutes les notifications comme lues
    static async markAllAsRead(): Promise<void> {
        try {
            await models.notification.update({ isRead: true }, { where: { isRead: false } });
        } catch (error) {
            console.error('Erreur lors de la mise à jour des notifications:', error);
            throw new Error('Impossible de mettre à jour les notifications');
        }
    }

    // Compter les notifications non lues
    static async countUnread(): Promise<number> {
        try {
            const count = await models.notification.count({
                where: { isRead: false },
            });
            return count;
        } catch (error) {
            console.error('Erreur lors du comptage des notifications:', error);
            throw new Error('Impossible de compter les notifications');
        }
    }

    // Créer une notification pour une nouvelle commande
    static async createOrderNotification(orderId: string, orderNumber: string): Promise<Notification> {
        return this.createNotification({
            orderId,
            type: 'new_order' as NotificationType,
            title: 'Nouvelle commande',
            message: `Nouvelle commande ${orderNumber} reçue`,
        });
    }

    // Créer une notification pour un paiement reçu
    static async createPaymentNotification(
        orderId: string,
        orderNumber: string,
        amount: number,
    ): Promise<Notification> {
        return this.createNotification({
            orderId,
            type: 'payment_received' as NotificationType,
            title: 'Paiement reçu',
            message: `Paiement de ${(amount / 100).toFixed(2)}€ reçu pour la commande ${orderNumber}`,
        });
    }
}

