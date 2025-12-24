import cron from 'node-cron';
import { OrderService } from '../services/OrderService';

// Exécuter tous les jours pour vérifier les liens de paiement expirés
export const startExpiredOrdersCleanup = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Vérification des liens de paiement expirés...');
        try {
            await OrderService.checkExpiredPaymentLinks();
            console.log('Vérification terminée.');
        } catch (error) {
            console.error('Erreur lors de la vérification des liens expirés:', error);
        }
    });

    console.log('Job cron de nettoyage des commandes expirées démarré (tous les jours)');
};
