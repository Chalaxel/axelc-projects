import { Request } from 'express';
import { Method } from '../types';
import { ArticleService } from '../services/ArticleService';

export const articlesRoutes = [
    {
        path: '/',
        method: Method.GET,
        handler: async (req: Request) => {
            return ArticleService.getAllPublishedArticles();
        },
    },
    {
        path: '/all',
        method: Method.GET,
        handler: async (req: Request) => {
            return ArticleService.getAllArticles();
        },
    },
    {
        path: '/categories',
        method: Method.GET,
        handler: async (req: Request) => {
            return ArticleService.getCategories();
        },
    },
    {
        path: '/featured',
        method: Method.GET,
        handler: async (req: Request) => {
            return ArticleService.getFeaturedArticle();
        },
    },
    {
        path: '/:articleId',
        method: Method.GET,
        handler: async (req: Request) => {
            const { articleId } = req.params;
            return ArticleService.getArticleById(articleId);
        },
    },
    {
        path: '/slug/:slug',
        method: Method.GET,
        handler: async (req: Request) => {
            const { slug } = req.params;
            return ArticleService.getArticleBySlug(slug);
        },
    },
    {
        path: '/',
        method: Method.POST,
        handler: async (req: Request) => {
            return ArticleService.createArticle(req.body);
        },
    },
    {
        path: '/:articleId',
        method: Method.PUT,
        handler: async (req: Request) => {
            const { articleId } = req.params;
            return ArticleService.updateArticle(articleId, req.body);
        },
    },
    {
        path: '/:articleId',
        method: Method.DELETE,
        handler: async (req: Request) => {
            const { articleId } = req.params;
            const success = await ArticleService.deleteArticle(articleId);
            return { success };
        },
    },
];
