// backend/src/models/order-items.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { OrderItem, Product, ProductVariant } from '@monorepo/shared-types';

// Interface pour les attributs du modèle avec les propriétés Sequelize
interface OrderItemAttributes {
    id: string;
    orderId: string;
    productId: string;
    variantId: string;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    product?: Product;
    variant?: ProductVariant;
}

// Interface pour la création (sans les champs auto-générés)
interface OrderItemCreationAttributes {
    orderId: string;
    productId: string;
    variantId: string;
    price: number;
    quantity: number;
}

// Classe du modèle OrderItem
export class OrderItemModel
    extends Model<OrderItemAttributes, OrderItemCreationAttributes>
    implements OrderItemAttributes
{
    public id!: string;
    public orderId!: string;
    public productId!: string;
    public variantId!: string;
    public price!: number;
    public quantity!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    // Relations optionnelles
    public product?: Product;
    public variant?: ProductVariant;

    // Méthodes d'instance optionnelles
    public override toJSON(): OrderItem {
        return {
            id: this.id,
            orderId: this.orderId,
            productId: this.productId,
            variantId: this.variantId,
            price: this.price,
            quantity: this.quantity,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            ...(this.product && { product: this.product }),
            ...(this.variant && { variant: this.variant }),
        } as OrderItem;
    }
}

OrderItemModel.init(
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
            onDelete: 'CASCADE',
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
        },
        variantId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'product_variants',
                key: 'id',
            },
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
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
        modelName: 'OrderItemModel',
        tableName: 'order_items',
    },
);
