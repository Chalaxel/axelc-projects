import { useQuery } from '@tanstack/react-query';
import { Product } from '@monorepo/shared-types';
import { productService } from '../../services/productService';

export interface ProductWithFirstVariant extends Product {
    preview?: string | undefined;
}

export const useProductsWithVariants = () => {
    const { data, isLoading, error } = useQuery<ProductWithFirstVariant[]>({
        queryKey: ['products-available-with-variants'],
        queryFn: async (): Promise<ProductWithFirstVariant[]> => {
            const productsWithPreview = await productService.getAllProductsWithVariants();

            return productsWithPreview.map(p => ({
                ...p,
                // On garde la compatibilité si ailleurs on attendait preview
                preview: p.preview,
            }));
        },
        staleTime: 5 * 60 * 1000,
    });

    return {
        products: data || [],
        isLoading,
        error,
    };
};
