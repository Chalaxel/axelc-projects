import { DataTypes, Model, ModelStatic, Sequelize, Optional } from 'sequelize';
import { UserGoal, UserGoalStatus, UserLevel } from '@shared/types';

interface GoalAttributes extends UserGoal {
    userId: string;
}

interface GoalCreationAttributes extends Optional<GoalAttributes, 'id'> {}

export interface GoalInstance
    extends Model<GoalAttributes, GoalCreationAttributes>, GoalAttributes {}

let GoalModel: ModelStatic<GoalInstance> | null = null;

export const initGoalModel = (sequelize: Sequelize): ModelStatic<GoalInstance> => {
    if (!GoalModel) {
        GoalModel = sequelize.define<GoalInstance>(
            'Goal',
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                },
                level: {
                    type: DataTypes.ENUM(...Object.values(UserLevel)),
                    allowNull: false,
                    defaultValue: UserLevel.BEGINNER,
                },
                weeklyAvailability: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                targetDistance: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                raceDate: {
                    type: DataTypes.STRING, // storing as ISO string or DATE based on shared type? Shared type says string for UserGoal
                    allowNull: true,
                },
                status: {
                    type: DataTypes.ENUM(...Object.values(UserGoalStatus)),
                    defaultValue: UserGoalStatus.ACTIVE,
                },
            },
            {
                tableName: 'goals',
                timestamps: true,
            },
        ) as ModelStatic<GoalInstance>;
    }
    return GoalModel;
};

export const getGoalModel = (): ModelStatic<GoalInstance> => {
    if (!GoalModel) {
        throw new Error('GoalModel not initialized. Call initGoalModel first.');
    }
    return GoalModel;
};
