// backend/src/utils/dbSync.ts
import sequelize from '../config/database';
import { MigrationManager } from './migrationManager';

export const initializeDatabase = async (): Promise<void> => {
    try {
        const migrationManager = new MigrationManager(sequelize);
        await migrationManager.initializeDatabase();
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation de la base de données:", error);
        throw error;
    }
};

export const closeDatabase = async (): Promise<void> => {
    try {
        await sequelize.close();
        console.log('✅ Connexion à la base de données fermée');
    } catch (error) {
        console.error('❌ Erreur lors de la fermeture de la base de données:', error);
    }
};
