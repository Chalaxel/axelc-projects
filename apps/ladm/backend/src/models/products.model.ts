// backend/src/models/products.model.ts
import { DataTypes, Model, Optional, Association, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database';
import { Product, ProductCreationAttributes } from '@monorepo/shared-types';
import type { ProductVariantModel } from './product-variants.model';

// Interface pour les attributs du modèle avec les propriétés Sequelize
interface ProductAttributes extends Product {
    variants?: any[];
}

// Classe du modèle Product
export class ProductModel
    extends Model<ProductAttributes, ProductCreationAttributes>
    implements ProductAttributes
{
    public id!: string;
    public name!: string;
    public price!: number;
    public categoryId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    // Associations
    public getVariants!: HasManyGetAssociationsMixin<ProductVariantModel>;
    public readonly variants?: ProductVariantModel[];

    public static override associations: {
        variants: Association<ProductModel, ProductVariantModel>;
    };

    // Méthodes d'instance optionnelles
    public override toJSON(): Product {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            categoryId: this.categoryId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

ProductModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
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
        modelName: 'ProductModel',
        tableName: 'products',
    },
);
