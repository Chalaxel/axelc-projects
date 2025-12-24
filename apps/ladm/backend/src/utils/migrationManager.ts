// backend/src/utils/migrationManager.ts
import { Sequelize, QueryTypes } from 'sequelize';

// Liste des migrations attendues (basée sur les fichiers dans src/migrations)
const EXPECTED_MIGRATIONS = [
    '20251001000000-create-category.ts',
    '20251012000000-create-products.ts',
    '20251025000000-create-product-variants.ts',
    '20251026000000-add-uuid-defaults.ts',
    '20251103000000-update-product-variants-to-status.ts',
    '20251103000001-create-orders.ts',
    '20251103000002-create-order-items.ts',
    '20251103000003-create-notifications.ts',
    '20251105000001-remove-order-items-redundant-columns.ts',
    '20251115223628-add-validation-workflow-fields.ts',
    '20251116000000-add-checkout-id-to-orders.ts',
];

export class MigrationManager {
    private sequelize: Sequelize;

    constructor(sequelize: Sequelize) {
        this.sequelize = sequelize;
    }

    /**
     * Récupère les migrations déjà exécutées depuis la table SequelizeMeta
     */
    async getExecutedMigrations(): Promise<string[]> {
        try {
            const tableExists = await this.checkMetaTableExists();
            if (!tableExists) {
                return [];
            }

            const results = await this.sequelize.query<{ name: string }>(
                'SELECT name FROM "SequelizeMeta" ORDER BY name',
                { type: QueryTypes.SELECT },
            );
            return results.map((row) => row.name);
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des migrations exécutées:', error);
            return [];
        }
    }

    /**
     * Vérifie si la table SequelizeMeta existe
     */
    private async checkMetaTableExists(): Promise<boolean> {
        try {
            const results = await this.sequelize.query<{ exists: boolean }>(
                `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'SequelizeMeta'
        )`,
                { type: QueryTypes.SELECT },
            );
            return results[0]?.exists ?? false;
        } catch {
            return false;
        }
    }

    /**
     * Vérifie si des migrations sont en attente
     */
    async hasPendingMigrations(): Promise<boolean> {
        try {
            const executed = await this.getExecutedMigrations();
            const pending = EXPECTED_MIGRATIONS.filter((m) => !executed.includes(m));
            return pending.length > 0;
        } catch {
            return true;
        }
    }

    /**
     * Retourne la liste des migrations en attente
     */
    async getPendingMigrations(): Promise<string[]> {
        const executed = await this.getExecutedMigrations();
        return EXPECTED_MIGRATIONS.filter((m) => !executed.includes(m));
    }

    /**
     * Initialise la base de données avec migrations et seeders si nécessaire
     */
    async initializeDatabase(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            console.log('✅ Connexion à la base de données établie avec succès');

            const pendingMigrations = await this.getPendingMigrations();
            if (pendingMigrations.length > 0) {
                console.log(`⚠️ ${pendingMigrations.length} migration(s) en attente:`);
                pendingMigrations.forEach((m) => console.log(`   - ${m}`));
            } else {
                console.log('✅ Toutes les migrations sont à jour');
            }
        } catch (error) {
            console.error("❌ Erreur lors de l'initialisation de la base de données:", error);
            throw error;
        }
    }
}
