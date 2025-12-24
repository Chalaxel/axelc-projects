import api from './api';
import { Page, PageUpdateAttributes } from '@monorepo/shared-types';

export const pageService = {
    async getPageBySlug(slug: string): Promise<Page> {
        const response = await api.get<Page>(`/pages/${slug}`);
        return response.data;
    },

    async updatePage(slug: string, data: PageUpdateAttributes): Promise<Page> {
        const response = await api.put<Page>(`/pages/${slug}`, data);
        return response.data;
    },

    async getAllPages(): Promise<Page[]> {
        const response = await api.get<{ items: Page[] }>('/pages');
        return response.data.items;
    },
};
