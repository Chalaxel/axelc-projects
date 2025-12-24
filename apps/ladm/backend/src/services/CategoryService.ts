import { models } from '../models/models';
import { Category, CategoryCreationAttributes } from '@monorepo/shared-types';

export class CategoryService {
    static async getAllCategories(): Promise<Category[]> {
        try {
            const categories = await models.category.findAll({
                raw: true,
            });

            return categories;
        } catch (error) {
            console.error('Erreur lors de la récupération des categories:', error);
            throw new Error('Impossible de récupérer les categories');
        }
    }

    static async getCategoryById(categoryId: string): Promise<Category | null> {
        try {
            const category = await models.category.findByPk(categoryId, {
                raw: true,
            });

            return category;
        } catch (error) {
            console.error('Erreur lors de la récupération de la catégorie:', error);
            throw new Error('Impossible de récupérer la catégorie');
        }
    }

    static async createCategory(categoryData: CategoryCreationAttributes): Promise<Category> {
        try {
            const category = await models.category.create(categoryData);
            return category.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la création de la catégorie:', error);
            throw new Error('Impossible de créer la catégorie');
        }
    }

    static async updateCategory(
        categoryId: string,
        categoryData: Partial<CategoryCreationAttributes>,
    ): Promise<Category | null> {
        try {
            const category = await models.category.findByPk(categoryId);

            if (!category) {
                return null;
            }

            await category.update(categoryData);
            return category.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie:', error);
            throw new Error('Impossible de mettre à jour la catégorie');
        }
    }

    static async deleteCategory(categoryId: string): Promise<boolean> {
        try {
            const category = await models.category.findByPk(categoryId);

            if (!category) {
                return false;
            }

            // Vérifier s'il y a des produits associés
            const productsCount = await models.product.count({
                where: { categoryId },
            });

            if (productsCount > 0) {
                throw new Error(
                    'Impossible de supprimer cette catégorie car elle contient des produits',
                );
            }

            await category.destroy();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie:', error);
            throw error;
        }
    }
}
