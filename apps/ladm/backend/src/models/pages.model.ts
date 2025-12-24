import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Page, PageCreationAttributes, PageMetadata } from '@monorepo/shared-types';

interface PageAttributes extends Page {}

export class PageModel
    extends Model<PageAttributes, PageCreationAttributes>
    implements PageAttributes
{
    public id!: string;
    public slug!: string;
    public title!: string;
    public content!: string;
    public metadata?: PageMetadata;
    public createdAt!: Date;
    public updatedAt!: Date;

    public override toJSON(): Page {
        return {
            id: this.id,
            slug: this.slug,
            title: this.title,
            content: this.content,
            metadata: this.metadata,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

PageModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        slug: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        metadata: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const value = this.getDataValue('metadata');
                if (typeof value === 'string') {
                    try {
                        return JSON.parse(value);
                    } catch {
                        return undefined;
                    }
                }
                return value;
            },
            set(value: PageMetadata | undefined) {
                if (value) {
                    this.setDataValue('metadata', JSON.stringify(value) as unknown as PageMetadata);
                } else {
                    this.setDataValue('metadata', undefined);
                }
            },
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
        modelName: 'PageModel',
        tableName: 'pages',
    },
);
