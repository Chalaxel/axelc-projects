import { DataTypes, Model, ModelStatic, Sequelize, Optional } from 'sequelize';
import { GoalAttributes, GoalStatus } from '@shared/types';

type GoalCreationAttributes = Optional<GoalAttributes, 'id'>;

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
                weeklyTrainingNumbers: {
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
                    type: DataTypes.STRING,
                    defaultValue: GoalStatus.ACTIVE,
                },
                periods: {
                    type: DataTypes.JSONB,
                    allowNull: false,
                    defaultValue: {},
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
