import { Notification } from '@monorepo/shared-types';
import api from './api';

export const notificationService = {
    // Récupérer toutes les notifications
    async getAllNotifications(limit = 50, offset = 0): Promise<Notification[]> {
        const response = await api.get(`/notifications?limit=${limit}&offset=${offset}`);
        return response.data.items || response.data;
    },

    // Récupérer les notifications non lues
    async getUnreadNotifications(): Promise<Notification[]> {
        const response = await api.get(`/notifications/unread`);
        return response.data.items || response.data;
    },

    // Compter les notifications non lues
    async countUnread(): Promise<number> {
        const response = await api.get(`/notifications/unread/count`);
        return response.data.count;
    },

    // Marquer une notification comme lue
    async markAsRead(notificationId: string): Promise<Notification> {
        const response = await api.patch(`/notifications/${notificationId}/read`);
        return response.data;
    },

    // Marquer toutes les notifications comme lues
    async markAllAsRead(): Promise<void> {
        await api.post(`/notifications/read-all`);
    },
};
