import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('order_items', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            orderId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            productName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            variantId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            variantName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            variantImageBase64: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
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

        // Ajouter un index sur orderId pour les jointures rapides
        await queryInterface.addIndex('order_items', ['orderId']);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('order_items');
    },
};

