import { Request } from 'express';
import { PageService } from '../services/PageService';
import { Route, Method } from '../types';

export const pagesRoutes: Route[] = [
    {
        method: Method.GET,
        path: '/',
        handler: async () => {
            const pages = await PageService.getAllPages();
            return { items: pages };
        },
    },
    {
        method: Method.GET,
        path: '/:slug',
        handler: async (req: Request) => {
            const { slug } = req.params;
            const page = await PageService.getPageBySlug(slug);
            return page;
        },
    },
    {
        method: Method.PUT,
        path: '/:slug',
        handler: async (req: Request) => {
            const { slug } = req.params;
            const { title, content, metadata } = req.body;
            const page = await PageService.updatePage(slug, { title, content, metadata });
            return page;
        },
    },
];
