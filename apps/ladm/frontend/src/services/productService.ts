import api from './api';
import { Product, ProductVariant, ProductCreationAttributes } from '@monorepo/shared-types';

export interface ProductWithVariants extends Product {
    variants: ProductVariant[];
}

export interface ProductWithPreview extends Product {
    preview?: string;
    variants?: ProductVariant[]; // Optionnel car on peut avoir l'un ou l'autre
}

export const productService = {
    async getAllProducts(): Promise<Product[]> {
        const response = await api.get<{ items: Product[] }>('/products');
        return response.data.items;
    },

    async getAllProductsWithVariants(): Promise<ProductWithPreview[]> {
        const response = await api.get<{ items: ProductWithPreview[] }>(
            '/products?includeVariants=true',
        );
        return response.data.items;
    },

    async getAllProductsAdmin(): Promise<Product[]> {
        const response = await api.get<{ items: Product[] }>('/products/all');
        return response.data.items;
    },

    async getProductById(productId: string): Promise<Product> {
        const response = await api.get<Product>(`/products/${productId}`);
        return response.data;
    },

    async getProductWithVariants(productId: string): Promise<ProductWithVariants> {
        const response = await api.get<ProductWithVariants>(
            `/products/${productId}?includeVariants=true`,
        );
        return response.data;
    },

    async getProductWithAllVariants(productId: string): Promise<ProductWithVariants> {
        const response = await api.get<ProductWithVariants>(
            `/products/${productId}?includeVariants=true&onlyAvailable=false`,
        );
        return response.data;
    },

    async createProduct(productData: ProductCreationAttributes): Promise<Product> {
        const response = await api.post<Product>('/products', productData);
        return response.data;
    },

    async updateProduct(
        productId: string,
        productData: Partial<ProductCreationAttributes>,
    ): Promise<Product> {
        const response = await api.put<Product>(`/products/${productId}`, productData);
        return response.data;
    },

    async deleteProduct(productId: string): Promise<boolean> {
        const response = await api.delete<{ success: boolean }>(`/products/${productId}`);
        return response.data.success;
    },

    async getProductVariants(productId: string): Promise<ProductVariant[]> {
        const response = await api.get<{ items: ProductVariant[] }>(
            `/products/${productId}/variants`,
        );
        return response.data.items;
    },

    async createVariant(
        productId: string,
        variantData: Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>,
    ): Promise<ProductVariant> {
        const response = await api.post<ProductVariant>(
            `/products/${productId}/variants`,
            variantData,
        );
        return response.data;
    },

    async updateVariant(
        variantId: string,
        variantData: Partial<Omit<ProductVariant, 'id' | 'productId' | 'createdAt' | 'updatedAt'>>,
    ): Promise<ProductVariant> {
        const response = await api.put<ProductVariant>(
            `/products/variants/${variantId}`,
            variantData,
        );
        return response.data;
    },

    async deleteVariant(variantId: string): Promise<boolean> {
        const response = await api.delete<{ success: boolean }>(`/products/variants/${variantId}`);
        return response.data.success;
    },

    async updateVariantStock(variantId: string, stockChange: number): Promise<ProductVariant> {
        const response = await api.patch<ProductVariant>(`/products/variants/${variantId}/stock`, {
            stockChange,
        });
        return response.data;
    },
};
