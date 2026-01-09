import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { User, UserCreationAttributes } from '@shared/types';

interface UserInstance extends Model<User, UserCreationAttributes>, User {}

let UserModel: ModelStatic<UserInstance> | null = null;

export const initUserModel = (sequelize: Sequelize): ModelStatic<UserInstance> => {
    if (!UserModel) {
        UserModel = sequelize.define<UserInstance>(
            'User',
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        isEmail: true,
                    },
                },
                profile: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING,
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
                tableName: 'users',
                timestamps: true,
            },
        ) as ModelStatic<UserInstance>;
    }
    return UserModel;
};

export const getUserModel = (): ModelStatic<UserInstance> => {
    if (!UserModel) {
        throw new Error('UserModel not initialized. Call initUserModel first.');
    }
    return UserModel;
};

export { UserModel };
export default UserModel;
