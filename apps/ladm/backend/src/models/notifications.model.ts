// backend/src/models/notifications.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Notification, NotificationCreationAttributes, NotificationType } from '@monorepo/shared-types';

// Interface pour les attributs du modèle avec les propriétés Sequelize
interface NotificationAttributes extends Notification {}

// Classe du modèle Notification
export class NotificationModel
    extends Model<NotificationAttributes, NotificationCreationAttributes>
    implements NotificationAttributes
{
    public id!: string;
    public orderId!: string;
    public type!: NotificationType;
    public title!: string;
    public message!: string;
    public isRead!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;

    // Méthodes d'instance optionnelles
    public override toJSON(): Notification {
        return {
            id: this.id,
            orderId: this.orderId,
            type: this.type,
            title: this.title,
            message: this.message,
            isRead: this.isRead,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

NotificationModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
        },
        type: {
            type: DataTypes.ENUM('new_order', 'payment_received', 'order_cancelled'),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'NotificationModel',
        tableName: 'notifications',
    },
);

