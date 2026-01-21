import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn('goals', 'periods', {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
    });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeColumn('goals', 'periods');
};
