import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('notifications', {
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
            type: {
                type: DataTypes.ENUM('new_order', 'payment_received', 'order_cancelled'),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
        await queryInterface.addIndex('notifications', ['orderId']);
        // Ajouter un index sur isRead pour filtrer les non lues
        await queryInterface.addIndex('notifications', ['isRead']);
        // Ajouter un index sur createdAt pour le tri chronologique
        await queryInterface.addIndex('notifications', ['createdAt']);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('notifications');
    },
};

