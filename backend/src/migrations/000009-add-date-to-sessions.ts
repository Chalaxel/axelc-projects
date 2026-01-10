import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn('sessions', 'date', {
        type: DataTypes.DATEONLY,
        allowNull: true,
    });

    await queryInterface.addColumn('sessions', 'weekNumber', {
        type: DataTypes.INTEGER,
        allowNull: true,
    });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeColumn('sessions', 'weekNumber');
    await queryInterface.removeColumn('sessions', 'date');
};
