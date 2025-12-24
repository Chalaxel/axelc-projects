import { useQuery } from '@tanstack/react-query';
import { Product } from '@monorepo/shared-types';
import { ProductRepository } from '../../data/repositories/ProductRepository';

export const useProducts = () => {
    const { data = [] } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: () => ProductRepository.getAll(),
    });

    return data;
};
