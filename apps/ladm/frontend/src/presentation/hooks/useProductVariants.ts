import { useQuery } from '@tanstack/react-query';
import { ProductVariant } from '@monorepo/shared-types';
import { productService } from '../../services/productService';

export const useProductVariants = (productId: string | undefined) => {
    const { data, isLoading, error } = useQuery<ProductVariant[]>({
        queryKey: ['product-variants', productId],
        queryFn: () => {
            if (!productId) {
                return Promise.resolve([]);
            }
            return productService.getProductVariants(productId);
        },
        enabled: !!productId,
    });

    return {
        variants: data || [],
        isLoading,
        error,
    };
};

export const useProductWithVariants = (productId: string | undefined) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['product-with-variants', productId],
        queryFn: () => {
            if (!productId) {
                return Promise.resolve(null);
            }
            return productService.getProductWithVariants(productId);
        },
        enabled: !!productId,
    });

    return {
        product: data,
        isLoading,
        error,
    };
};
