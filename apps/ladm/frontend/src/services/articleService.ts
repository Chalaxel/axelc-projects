import api from './api';
import { Article, ArticleCreationAttributes } from '@monorepo/shared-types';

export const articleService = {
    async getAllArticles(): Promise<Article[]> {
        const response = await api.get<{ items: Article[] }>('/articles');
        return response.data.items;
    },

    async getAllArticlesAdmin(): Promise<Article[]> {
        const response = await api.get<{ items: Article[] }>('/articles/all');
        return response.data.items;
    },

    async getArticleById(articleId: string): Promise<Article> {
        const response = await api.get<Article>(`/articles/${articleId}`);
        return response.data;
    },

    async getArticleBySlug(slug: string): Promise<Article> {
        const response = await api.get<Article>(`/articles/slug/${slug}`);
        return response.data;
    },

    async getFeaturedArticle(): Promise<Article | null> {
        const response = await api.get<Article | null>('/articles/featured');
        return response.data;
    },

    async getCategories(): Promise<string[]> {
        const response = await api.get<{ items: string[] }>('/articles/categories');
        return response.data.items;
    },

    async createArticle(articleData: ArticleCreationAttributes): Promise<Article> {
        const response = await api.post<Article>('/articles', articleData);
        return response.data;
    },

    async updateArticle(
        articleId: string,
        articleData: Partial<ArticleCreationAttributes>,
    ): Promise<Article> {
        const response = await api.put<Article>(`/articles/${articleId}`, articleData);
        return response.data;
    },

    async deleteArticle(articleId: string): Promise<boolean> {
        const response = await api.delete<{ success: boolean }>(`/articles/${articleId}`);
        return response.data.success;
    },
};

export function textToHtml(text: string): string {
    if (!text) {
        return '';
    }

    const paragraphs = text
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

export function htmlToText(html: string): string {
    if (!html) {
        return '';
    }

    return html
        .replace(/<\/p><p>/g, '\n\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<\/?p>/g, '')
        .replace(/<[^>]*>/g, '')
        .trim();
}

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
}
