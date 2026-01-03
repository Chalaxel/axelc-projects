import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn('sessions', 'userId', {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('sessions', ['userId'], {
        name: 'sessions_userId_index',
    });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeIndex('sessions', 'sessions_userId_index');
    await queryInterface.removeColumn('sessions', 'userId');
};
