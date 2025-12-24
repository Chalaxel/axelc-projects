// backend/src/models/orders.model.ts
import { DataTypes, Model, Association, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database';
import {
    Order,
    OrderCreationAttributes,
    OrderStatus,
    OrderMetadata,
    PaymentMethod,
    ShippingInfo,
} from '@monorepo/shared-types';
import type { OrderItemModel } from './order-items.model';

// Interface pour les attributs du modèle avec les propriétés Sequelize
interface OrderAttributes extends Order {}

// Classe du modèle Order
export class OrderModel
    extends Model<OrderAttributes, OrderCreationAttributes>
    implements OrderAttributes
{
    public id!: string;
    public orderNumber!: string;
    public status!: OrderStatus;
    public paymentMethod!: PaymentMethod;
    public paymentId?: string;
    public checkoutId?: string;
    public totalAmount!: number;
    public shippingCost?: number;
    public shippingInfo!: ShippingInfo;
    public notes?: string;
    public metadata?: OrderMetadata;
    public validatedAt?: Date;
    public paymentLinkExpiresAt?: Date;
    public createdAt!: Date;
    public updatedAt!: Date;

    // Associations
    public getItems!: HasManyGetAssociationsMixin<OrderItemModel>;
    public readonly items?: OrderItemModel[];

    public static override associations: {
        items: Association<OrderModel, OrderItemModel>;
    };

    // Méthodes d'instance optionnelles
    public override toJSON(): Order {
        return {
            id: this.id,
            orderNumber: this.orderNumber,
            status: this.status,
            paymentMethod: this.paymentMethod,
            paymentId: this.paymentId,
            checkoutId: this.checkoutId,
            totalAmount: this.totalAmount,
            shippingCost: this.shippingCost,
            shippingInfo: this.shippingInfo,
            notes: this.notes,
            metadata: this.metadata,
            validatedAt: this.validatedAt,
            paymentLinkExpiresAt: this.paymentLinkExpiresAt,
            items: this.items?.map((item) => item.toJSON()),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

OrderModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM(
                'pending_validation',
                'validated_awaiting_payment',
                'pending',
                'paid',
                'preparing',
                'shipped',
                'delivered',
                'cancelled',
            ),
            allowNull: false,
            defaultValue: 'pending_validation',
        },
        paymentMethod: {
            type: DataTypes.ENUM('sumup_online', 'sumup_physical'),
            allowNull: false,
        },
        paymentId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        checkoutId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        totalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        shippingCost: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        shippingInfo: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
        validatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        paymentLinkExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
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
        modelName: 'OrderModel',
        tableName: 'orders',
    },
);
