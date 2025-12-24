import api from './api';
import { Category, CategoryCreationAttributes } from '@monorepo/shared-types';

export const categoryService = {
    async getAllCategories(): Promise<Category[]> {
        const response = await api.get<{ items: Category[] }>('/categories');
        return response.data.items;
    },

    async getCategoryById(categoryId: string): Promise<Category> {
        const response = await api.get<Category>(`/categories/${categoryId}`);
        return response.data;
    },

    async createCategory(categoryData: CategoryCreationAttributes): Promise<Category> {
        const response = await api.post<Category>('/categories', categoryData);
        return response.data;
    },

    async updateCategory(
        categoryId: string,
        categoryData: Partial<CategoryCreationAttributes>,
    ): Promise<Category> {
        const response = await api.put<Category>(`/categories/${categoryId}`, categoryData);
        return response.data;
    },

    async deleteCategory(categoryId: string): Promise<boolean> {
        const response = await api.delete<{ success: boolean }>(`/categories/${categoryId}`);
        return response.data.success;
    },
};

