import React from 'react';
import { Category } from '@monorepo/shared-types';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    priceRange: [number, number];
    onPriceRangeChange: (range: [number, number]) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
    categories,
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceRangeChange,
}) => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.filterSection}>
                <h3>Catégories</h3>
                <div className={styles.categoryList}>
                    <button
                        className={`${styles.categoryButton} ${
                            selectedCategory === 'Tous' ? styles.active : ''
                        }`}
                        onClick={() => onCategoryChange('')}
                    >
                        Tous
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`${styles.categoryButton} ${
                                selectedCategory === category.id ? styles.active : ''
                            }`}
                            onClick={() => onCategoryChange(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.filterSection}>
                <h3>Prix</h3>
                <div className={styles.priceRanges}>
                    {[
                        { label: 'Tous les prix', range: [0, 1000] },
                        { label: 'Moins de 10€', range: [0, 10] },
                        { label: '10€ à 20€', range: [10, 20] },
                        { label: '20€ à 50€', range: [20, 50] },
                        { label: 'Plus de 50€', range: [50, 1000] },
                    ].map(item => (
                        <button
                            key={item.label}
                            className={`${styles.rangeButton} ${
                                priceRange[0] === item.range[0] && priceRange[1] === item.range[1]
                                    ? styles.active
                                    : ''
                            }`}
                            onClick={() => onPriceRangeChange(item.range as [number, number])}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};
