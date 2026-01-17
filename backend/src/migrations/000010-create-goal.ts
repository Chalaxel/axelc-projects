import { GoalStatus } from '@shared/types';
import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('goals', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        weeklyTrainingNumbers: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        targetDistance: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        raceDate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: GoalStatus.ACTIVE,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });

    await queryInterface.addColumn('goals', 'userId', {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('goals', ['userId'], {
        name: 'goals_userId_index',
    });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('goals');
};
