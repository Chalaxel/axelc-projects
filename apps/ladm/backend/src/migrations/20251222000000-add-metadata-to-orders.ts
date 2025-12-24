import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn('orders', 'metadata', {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
    });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeColumn('orders', 'metadata');
};

