// backend/src/models/product-variants.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import {
    ProductVariant,
    ProductVariantCreationAttributes,
    ProductVariantStatus,
} from '@monorepo/shared-types';

// Interface pour les attributs du modèle avec les propriétés Sequelize
interface ProductVariantAttributes extends ProductVariant {
    image?: any;
}

// Classe du modèle ProductVariant
export class ProductVariantModel
    extends Model<ProductVariantAttributes, ProductVariantCreationAttributes>
    implements ProductVariantAttributes
{
    public id!: string;
    public productId!: string;
    public name!: string;
    public status!: ProductVariantStatus;
    public stock!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public image?: any; // Association 1:1

    // Méthodes d'instance optionnelles
    public override toJSON(): ProductVariant {
        return {
            id: this.id,
            productId: this.productId,
            name: this.name,
            status: this.status,
            stock: this.stock,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

ProductVariantModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('available', 'sold', 'reserved'),
            allowNull: false,
            defaultValue: 'available',
        },
        stock: {
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
        modelName: 'ProductVariantModel',
        tableName: 'product_variants',
    },
);
