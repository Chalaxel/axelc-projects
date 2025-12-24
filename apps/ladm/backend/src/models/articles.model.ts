import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Article, ArticleCreationAttributes } from '@monorepo/shared-types';

interface ArticleAttributes extends Article {}

export class ArticleModel
    extends Model<ArticleAttributes, ArticleCreationAttributes>
    implements ArticleAttributes
{
    public id!: string;
    public title!: string;
    public description!: string;
    public content!: string;
    public imageUrl!: string | null;
    public category!: string;
    public publishedAt!: Date | null;
    public status!: 'draft' | 'published';
    public isFeatured!: boolean;
    public slug!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    public override toJSON(): Article {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            content: this.content,
            imageUrl: this.imageUrl,
            category: this.category,
            publishedAt: this.publishedAt,
            status: this.status,
            isFeatured: this.isFeatured,
            slug: this.slug,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

ArticleModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('draft', 'published'),
            allowNull: false,
            defaultValue: 'draft',
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
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
        modelName: 'ArticleModel',
        tableName: 'articles',
    },
);
