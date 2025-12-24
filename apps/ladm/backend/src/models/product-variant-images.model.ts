// backend/src/models/product-variant-images.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface ProductVariantImage {
    id: string;
    variantId: string;
    imageBase64: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductVariantImageCreationAttributes extends Partial<ProductVariantImage> {
    variantId: string;
    imageBase64: string;
}

export class ProductVariantImageModel
    extends Model<ProductVariantImage, ProductVariantImageCreationAttributes>
    implements ProductVariantImage
{
    public id!: string;
    public variantId!: string;
    public imageBase64!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ProductVariantImageModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        variantId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: 'product_variants',
                key: 'id',
            },
        },
        imageBase64: {
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
        modelName: 'ProductVariantImageModel',
        tableName: 'product_variant_images',
    },
);
