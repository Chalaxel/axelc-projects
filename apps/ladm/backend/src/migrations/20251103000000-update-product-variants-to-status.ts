import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        // Créer le type ENUM pour status
        await queryInterface.sequelize.query(`
            CREATE TYPE "enum_product_variants_status" AS ENUM ('available', 'sold', 'reserved');
        `);

        // Ajouter la colonne status avec une valeur par défaut
        await queryInterface.addColumn('product_variants', 'status', {
            type: DataTypes.ENUM('available', 'sold', 'reserved'),
            allowNull: false,
            defaultValue: 'available',
        });

        // Mettre à jour les valeurs existantes : si isAvailable = true, status = 'available', sinon 'sold'
        await queryInterface.sequelize.query(`
            UPDATE product_variants
            SET status = CASE
                WHEN "isAvailable" = true THEN 'available'::enum_product_variants_status
                ELSE 'sold'::enum_product_variants_status
            END;
        `);

        // Supprimer les anciennes colonnes
        await queryInterface.removeColumn('product_variants', 'stock');
        await queryInterface.removeColumn('product_variants', 'isAvailable');
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        // Rajouter les anciennes colonnes
        await queryInterface.addColumn('product_variants', 'stock', {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });

        await queryInterface.addColumn('product_variants', 'isAvailable', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        });

        // Mettre à jour les valeurs : si status = 'available', isAvailable = true et stock = 1
        await queryInterface.sequelize.query(`
            UPDATE product_variants
            SET "isAvailable" = CASE
                WHEN status = 'available' THEN true
                ELSE false
            END,
            stock = CASE
                WHEN status = 'available' THEN 1
                ELSE 0
            END;
        `);

        // Supprimer la colonne status
        await queryInterface.removeColumn('product_variants', 'status');

        // Supprimer le type ENUM
        await queryInterface.sequelize.query(`
            DROP TYPE "enum_product_variants_status";
        `);
    },
};

