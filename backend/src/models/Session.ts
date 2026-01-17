import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { Session, SessionCreationAttributes } from '@shared/types';

export interface SessionInstance extends Model<Session, SessionCreationAttributes>, Session {}

let SessionModel: ModelStatic<SessionInstance> | null = null;

export const initSessionModel = (sequelize: Sequelize): ModelStatic<SessionInstance> => {
    if (!SessionModel) {
        SessionModel = sequelize.define<SessionInstance>(
            'Session',
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                sport: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                blocks: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                data: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: true,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                },
                date: {
                    type: DataTypes.DATEONLY,
                    allowNull: true,
                },
                weekNumber: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
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
                tableName: 'sessions',
                timestamps: true,
            },
        ) as ModelStatic<SessionInstance>;
    }
    return SessionModel;
};

export const getSessionModel = (): ModelStatic<SessionInstance> => {
    if (!SessionModel) {
        throw new Error('SessionModel not initialized. Call initSessionModel first.');
    }
    return SessionModel;
};

export { SessionModel };
export default SessionModel;
