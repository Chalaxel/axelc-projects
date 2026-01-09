import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { TriathlonPlan, TriathlonPlanCreationAttributes, TriathlonDistance } from '@shared/types';

interface TriathlonPlanInstance
    extends Model<TriathlonPlan, TriathlonPlanCreationAttributes>, TriathlonPlan {}

let TriathlonPlanModel: ModelStatic<TriathlonPlanInstance> | null = null;

export const initTriathlonPlanModel = (
    sequelize: Sequelize,
): ModelStatic<TriathlonPlanInstance> => {
    if (!TriathlonPlanModel) {
        TriathlonPlanModel = sequelize.define<TriathlonPlanInstance>(
            'TriathlonPlan',
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
                distance: {
                    type: DataTypes.ENUM(...Object.values(TriathlonDistance)),
                    allowNull: false,
                },
                weeklyHours: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                startDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false,
                },
                endDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false,
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
            },
            {
                tableName: 'triathlon_plans',
                timestamps: true,
            },
        ) as ModelStatic<TriathlonPlanInstance>;
    }
    return TriathlonPlanModel;
};

export const getTriathlonPlanModel = (): ModelStatic<TriathlonPlanInstance> => {
    if (!TriathlonPlanModel) {
        throw new Error('TriathlonPlanModel not initialized. Call initTriathlonPlanModel first.');
    }
    return TriathlonPlanModel;
};

export { TriathlonPlanModel };
export default TriathlonPlanModel;
