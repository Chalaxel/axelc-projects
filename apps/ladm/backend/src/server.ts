// backend/src/server.ts - Serveur TypeScript avec Sequelize
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, closeDatabase } from './utils/dbSync';
import { router } from './routes/routes';
import { startExpiredOrdersCleanup } from './jobs/expiredOrdersCleanup';

const logger = console;

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Écouter sur toutes les interfaces

// Middleware
app.use(cors());
// Augmenter la limite pour permettre l'upload d'images en base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware de logs simple avec types
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
});

app.use('/api', router);

// Gestion d'erreur typée
app.use((err: Error, req: Request, res: Response) => {
    logger.error('Erreur:', err.message);
    const errorResponse = {
        success: false,
        message: 'Erreur interne du serveur',
        timestamp: new Date(),
    };
    res.status(500).json(errorResponse);
});

// Fonction de démarrage avec initialisation de la base de données
const startServer = async (): Promise<void> => {
    // TOUJOURS démarrer le serveur en premier
    const server = app.listen(Number(PORT), HOST, () => {
        logger.log(`🚀 Backend TypeScript + Sequelize démarré sur http://${HOST}:${PORT}`);
        logger.log(`📡 API: http://${HOST}:${PORT}/api/hello`);
        logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.log(`🗄️ PostgreSQL Host: ${process.env.POSTGRESQL_ADDON_HOST || 'NON DÉFINI'}`);
        logger.log(`🗄️ PostgreSQL Port: ${process.env.POSTGRESQL_ADDON_PORT || 'NON DÉFINI'}`);
        logger.log(`🗄️ PostgreSQL DB: ${process.env.POSTGRESQL_ADDON_DB || 'NON DÉFINI'}`);
        logger.log(`🔑 DB_SSL: ${process.env.DB_SSL || 'NON DÉFINI'}`);

        // Vérifier la configuration email
        const emailConfigured =
            process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
        if (emailConfigured) {
            logger.log(`📧 Email: Configuré (${process.env.SMTP_HOST})`);
            logger.log(`📨 Seller Email: ${process.env.SELLER_EMAIL || 'NON DÉFINI'}`);
        } else {
            logger.warn(`⚠️ Email: NON CONFIGURÉ - Les emails ne seront pas envoyés`);
            logger.warn(`💡 Voir QUICK_EMAIL_SETUP.md ou EMAIL_SETUP_GUIDE.md`);
        }
    });

    // Essayer de se connecter à la DB APRÈS que le serveur ait démarré
    try {
        logger.log('🔄 Tentative de connexion à la base de données...');
        await initializeDatabase();
        logger.log('✅ Base de données connectée et initialisée');

        // Démarrer le job cron de nettoyage des commandes expirées
        startExpiredOrdersCleanup();
    } catch (error) {
        logger.error('❌ ERREUR DE CONNEXION À LA BASE DE DONNÉES:');
        logger.error(error);
        logger.warn('⚠️ Le serveur continue de fonctionner sans connexion DB');
        logger.warn("⚠️ Vérifiez que l'add-on PostgreSQL est configuré sur Clever Cloud");
        // NE PAS faire process.exit(1) - le serveur reste en vie
    }
};

// Gestion propre de l'arrêt du serveur
process.on('SIGINT', async () => {
    logger.log('\n🛑 Arrêt du serveur...');
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.log('\n🛑 Arrêt du serveur...');
    await closeDatabase();
    process.exit(0);
});

// Démarrer le serveur
startServer();
