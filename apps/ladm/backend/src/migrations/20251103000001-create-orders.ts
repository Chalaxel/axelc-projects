import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('orders', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            orderNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            status: {
                type: DataTypes.ENUM('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending',
            },
            paymentMethod: {
                type: DataTypes.ENUM('sumup_online', 'sumup_physical'),
                allowNull: false,
            },
            paymentId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            totalAmount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            shippingInfo: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        });

        // Ajouter un index sur orderNumber pour les recherches rapides
        await queryInterface.addIndex('orders', ['orderNumber']);
        // Ajouter un index sur status pour les filtres
        await queryInterface.addIndex('orders', ['status']);
        // Ajouter un index sur createdAt pour le tri chronologique
        await queryInterface.addIndex('orders', ['createdAt']);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('orders');
    },
};

