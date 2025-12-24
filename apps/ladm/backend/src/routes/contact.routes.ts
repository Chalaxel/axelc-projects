import { Route, Method } from '../types';
import { EmailService } from '../services/EmailService';

export const contactRoutes: Route[] = [
    {
        method: Method.POST,
        path: '/',
        handler: async (req) => {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return {
                    status: 'error',
                    message: 'Tous les champs sont requis (nom, email, message)',
                };
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    status: 'error',
                    message: 'Adresse email invalide',
                };
            }

            try {
                await EmailService.sendContactEmail({ name, email, message });
                return {
                    status: 'success',
                    message: 'Votre message a bien été envoyé !',
                };
            } catch (error) {
                console.error('Erreur envoi email contact:', error);
                return {
                    status: 'error',
                    message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
                };
            }
        },
    },
];
