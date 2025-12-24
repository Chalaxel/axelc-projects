import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.addColumn('orders', 'checkoutId', {
            type: DataTypes.STRING,
            allowNull: true,
        });

        // Ajouter un index sur checkoutId pour les recherches rapides
        await queryInterface.addIndex('orders', ['checkoutId']);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.removeColumn('orders', 'checkoutId');
    },
};
