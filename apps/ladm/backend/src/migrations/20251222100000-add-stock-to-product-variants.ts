import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        // Ajouter la colonne stock
        await queryInterface.addColumn('product_variants', 'stock', {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        });

        // Initialiser le stock selon le status actuel :
        // - available -> stock = 1
        // - sold ou reserved -> stock = 0
        await queryInterface.sequelize.query(`
            UPDATE product_variants
            SET stock = CASE
                WHEN status = 'available' THEN 1
                ELSE 0
            END;
        `);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.removeColumn('product_variants', 'stock');
    },
};
