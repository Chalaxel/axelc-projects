import { Request } from 'express';
import { Route, Method } from '../types';
import { NotificationService } from '../services/NotificationService';

// Middleware de protection vide pour le moment (à implémenter avec authentification)
const adminMiddleware = (req: Request, res: any, next: any) => {
    // TODO: Ajouter vérification d'authentification
    next();
};

export const notificationsRoutes: Route[] = [
    // Récupérer toutes les notifications
    {
        path: '/',
        method: Method.GET,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const { limit, offset } = req.query;
            return await NotificationService.getAllNotifications(
                limit ? parseInt(limit as string) : undefined,
                offset ? parseInt(offset as string) : undefined,
            );
        },
    },
    // Récupérer les notifications non lues
    {
        path: '/unread',
        method: Method.GET,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            return await NotificationService.getUnreadNotifications();
        },
    },
    // Compter les notifications non lues
    {
        path: '/unread/count',
        method: Method.GET,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const count = await NotificationService.countUnread();
            return { count };
        },
    },
    // Marquer une notification comme lue
    {
        path: '/:notificationId/read',
        method: Method.PATCH,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            const { notificationId } = req.params;
            const notification = await NotificationService.markAsRead(notificationId);

            if (!notification) {
                throw new Error('Notification introuvable');
            }

            return notification;
        },
    },
    // Marquer toutes les notifications comme lues
    {
        path: '/read-all',
        method: Method.POST,
        middlewares: [adminMiddleware],
        handler: async (req: Request) => {
            await NotificationService.markAllAsRead();
            return { success: true };
        },
    },
];
