// backend/src/models/categories.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Category, CategoryCreationAttributes } from '@monorepo/shared-types';

// Interface pour les attributs du modèle avec les propriétés Sequelize
interface CategoryAttributes extends Category {}

// Classe du modèle Category
export class CategoryModel
    extends Model<CategoryAttributes, CategoryCreationAttributes>
    implements CategoryAttributes
{
    public id!: string;
    public name!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    // Méthodes d'instance optionnelles
    public override toJSON(): Category {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

// Définition du modèle
CategoryModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        modelName: 'CategoryModel',
        tableName: 'categories',
    },
);
