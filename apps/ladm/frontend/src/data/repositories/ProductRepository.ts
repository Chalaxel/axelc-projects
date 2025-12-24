import { Product } from '@monorepo/shared-types';
import api from '../../services/api';

export class ProductRepository {
    static async getAll(): Promise<Product[]> {
        const response = await api.get('/products');

        return response.data.items;
    }
}
