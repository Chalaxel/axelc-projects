import { models } from '../models/models';
import { Article, ArticleCreationAttributes } from '@monorepo/shared-types';
import { Op } from 'sequelize';

export class ArticleService {
    static async getAllPublishedArticles(): Promise<Article[]> {
        try {
            const articles = await models.article.findAll({
                where: {
                    status: 'published',
                },
                order: [['publishedAt', 'DESC']],
                raw: true,
            });
            return articles;
        } catch (error) {
            console.error('Erreur lors de la récupération des articles publiés:', error);
            throw new Error('Impossible de récupérer les articles');
        }
    }

    static async getAllArticles(): Promise<Article[]> {
        try {
            const articles = await models.article.findAll({
                order: [['createdAt', 'DESC']],
                raw: true,
            });
            return articles;
        } catch (error) {
            console.error('Erreur lors de la récupération de tous les articles:', error);
            throw new Error('Impossible de récupérer les articles');
        }
    }

    static async getArticleById(articleId: string): Promise<Article | null> {
        try {
            const article = await models.article.findByPk(articleId, {
                raw: true,
            });
            return article;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'article:', error);
            throw new Error('Impossible de récupérer l\'article');
        }
    }

    static async getArticleBySlug(slug: string): Promise<Article | null> {
        try {
            const article = await models.article.findOne({
                where: { slug },
                raw: true,
            });
            return article;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'article par slug:', error);
            throw new Error('Impossible de récupérer l\'article');
        }
    }

    static async getFeaturedArticle(): Promise<Article | null> {
        try {
            const article = await models.article.findOne({
                where: {
                    status: 'published',
                    isFeatured: true,
                },
                order: [['publishedAt', 'DESC']],
                raw: true,
            });
            return article;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'article featured:', error);
            throw new Error('Impossible de récupérer l\'article featured');
        }
    }

    static async getCategories(): Promise<string[]> {
        try {
            const articles = await models.article.findAll({
                attributes: ['category'],
                where: { status: 'published' },
                group: ['category'],
                raw: true,
            });
            return articles.map((a: { category: string }) => a.category);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            throw new Error('Impossible de récupérer les catégories');
        }
    }

    static async createArticle(articleData: ArticleCreationAttributes): Promise<Article> {
        try {
            const article = await models.article.create({
                ...articleData,
                publishedAt: articleData.status === 'published' ? new Date() : null,
            });
            return article.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la création de l\'article:', error);
            throw new Error('Impossible de créer l\'article');
        }
    }

    static async updateArticle(
        articleId: string,
        articleData: Partial<ArticleCreationAttributes>,
    ): Promise<Article | null> {
        try {
            const article = await models.article.findByPk(articleId);

            if (!article) {
                return null;
            }

            const updateData: Partial<ArticleCreationAttributes> & { publishedAt?: Date | null } = {
                ...articleData,
            };

            if (articleData.status === 'published' && article.status === 'draft') {
                updateData.publishedAt = new Date();
            }

            await article.update(updateData);
            return article.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
            throw new Error('Impossible de mettre à jour l\'article');
        }
    }

    static async deleteArticle(articleId: string): Promise<boolean> {
        try {
            const article = await models.article.findByPk(articleId);

            if (!article) {
                return false;
            }

            await article.destroy();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article:', error);
            throw new Error('Impossible de supprimer l\'article');
        }
    }
}
