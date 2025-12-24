import { Category } from '@monorepo/shared-types';
import api from '../../services/api';

export class CategoriesRepository {
    static async getAll(): Promise<Category[]> {
        const response = await api.get('/categories');

        return response.data.items;
    }
}
