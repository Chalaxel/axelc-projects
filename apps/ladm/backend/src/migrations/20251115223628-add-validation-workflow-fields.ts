import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    // Ajouter les nouvelles colonnes
    await queryInterface.addColumn('orders', 'shippingCost', {
        type: DataTypes.INTEGER,
        allowNull: true,
    });

    await queryInterface.addColumn('orders', 'validatedAt', {
        type: DataTypes.DATE,
        allowNull: true,
    });

    await queryInterface.addColumn('orders', 'paymentLinkExpiresAt', {
        type: DataTypes.DATE,
        allowNull: true,
    });

    // Modifier l'ENUM status pour ajouter les nouveaux statuts
    await queryInterface.sequelize.query(`
        ALTER TYPE "enum_orders_status" ADD VALUE IF NOT EXISTS 'pending_validation';
    `);

    await queryInterface.sequelize.query(`
        ALTER TYPE "enum_orders_status" ADD VALUE IF NOT EXISTS 'validated_awaiting_payment';
    `);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    // Supprimer les colonnes ajoutées
    await queryInterface.removeColumn('orders', 'shippingCost');
    await queryInterface.removeColumn('orders', 'validatedAt');
    await queryInterface.removeColumn('orders', 'paymentLinkExpiresAt');

    // Note: Les valeurs ENUM ne peuvent pas être facilement supprimées dans PostgreSQL
    // Il faudrait recréer l'ENUM entièrement pour retirer les valeurs
};
