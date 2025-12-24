import { Request } from 'express';
import { Method } from '../types';
import { CategoryService } from '../services/CategoryService';

export const categoriesRoutes = [
    {
        path: '/',
        method: Method.GET,
        handler: async (req: Request) => {
            return CategoryService.getAllCategories();
        },
    },
    {
        path: '/',
        method: Method.POST,
        handler: async (req: Request) => {
            return CategoryService.createCategory(req.body);
        },
    },
    {
        path: '/:categoryId',
        method: Method.GET,
        handler: async (req: Request) => {
            const { categoryId } = req.params;
            return CategoryService.getCategoryById(categoryId);
        },
    },
    {
        path: '/:categoryId',
        method: Method.PUT,
        handler: async (req: Request) => {
            const { categoryId } = req.params;
            return CategoryService.updateCategory(categoryId, req.body);
        },
    },
    {
        path: '/:categoryId',
        method: Method.DELETE,
        handler: async (req: Request) => {
            const { categoryId } = req.params;
            const success = await CategoryService.deleteCategory(categoryId);
            return { success };
        },
    },
];
