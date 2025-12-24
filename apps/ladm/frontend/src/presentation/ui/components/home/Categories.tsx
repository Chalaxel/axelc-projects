import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import styles from './Categories.module.css';
import { Container } from '../layout/Container';
import { categoryService } from '../../../../services/categoryService';
import { Category } from '@monorepo/shared-types';

const categoryIcons: Record<string, string> = {
    default: '🎨',
};

const CategoryCard: React.FC<{ category: Category; index: number }> = ({ category, index }) => {
    const gradients = [
        'linear-gradient(135deg, #E0B894 0%, #CA8029 100%)',
        'linear-gradient(135deg, #8B7355 0%, #5C4033 100%)',
        'linear-gradient(135deg, #D4A574 0%, #8B6914 100%)',
        'linear-gradient(135deg, #C9A86C 0%, #9A7B4F 100%)',
    ];

    return (
        <Link to={`/products?category=${category.id}`} className={styles.category}>
            <div
                className={styles.categoryBackground}
                style={{ background: gradients[index % gradients.length] }}
            >
                <span className={styles.categoryIcon}>
                    {categoryIcons[category.name.toLowerCase()] || categoryIcons.default}
                </span>
            </div>
            <div className={styles.content}>
                <h3>{category.name}</h3>
            </div>
        </Link>
    );
};

export const Categories: React.FC = () => {
    const { data: categories, isLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: categoryService.getAllCategories,
    });

    if (isLoading) {
        return (
            <section className={styles.categories}>
                <Container>
                    <h2>Nos Catégories</h2>
                    <div className={styles.grid}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className={styles.categorySkeleton}>
                                <div className={styles.skeletonBg} />
                                <div className={styles.skeletonText} />
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        );
    }

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className={styles.categories}>
            <Container>
                <h2>Nos Catégories</h2>
                <div className={styles.grid}>
                    {categories.map((category, index) => (
                        <CategoryCard key={category.id} category={category} index={index} />
                    ))}
                </div>
            </Container>
        </section>
    );
};
