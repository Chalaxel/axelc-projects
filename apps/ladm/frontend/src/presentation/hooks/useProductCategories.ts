import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@monorepo/shared-types';
import { CategoriesRepository } from '../../data/repositories/CategoriesRepository';

export const useProductCategories = () => {
    const { data = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => CategoriesRepository.getAll(),
    });
    const categoriesDictionary = useMemo(() => {
        return data?.reduce(
            (acc, category) => {
                acc[category.id] = category;
                return acc;
            },
            {} as Record<string, Category>,
        );
    }, [data]);

    // if (data.length === 0) {
    //   return { 'id-toto': { txt_name_category: 'categ' } };
    // }
    return categoriesDictionary;
};
