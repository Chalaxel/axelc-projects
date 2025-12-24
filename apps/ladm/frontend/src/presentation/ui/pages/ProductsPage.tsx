import React, { useState } from 'react';
import styles from './ProductsPage.module.css';
import { useProductCategories } from '../../hooks/useProductCategories';
import { useProductsWithVariants } from '../../hooks/useProductsWithVariants';
import { ProductCard } from '../components/products/ProductCard';
import { FilterSidebar } from '../components/products/FilterSidebar';
import { Container } from '../components/layout/Container';
import { ProductCardSkeleton } from '../components/products/ProductCardSkeleton';

export const ProductsPage: React.FC = () => {
    const [categoryId, setCategoryId] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');

    const categoryDict = useProductCategories();
    const { products, isLoading } = useProductsWithVariants();

    const categories = Object.values(categoryDict);

    const filteredProducts = products
        .filter(
            product =>
                (!categoryId || product.categoryId === categoryId) &&
                product.price / 100 >= priceRange[0] &&
                product.price / 100 <= priceRange[1],
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                default:
                    return 0;
            }
        });

    return (
        <div className={styles.products}>
            <Container>
                <h1 className={styles.pageTitle}>Nos Produits</h1>

                <div className={styles.sortBar}>
                    <span>Trier par :</span>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as typeof sortBy)}
                        className={styles.sortSelect}
                    >
                        <option value='newest'>Plus récents</option>
                        <option value='price-asc'>Prix croissant</option>
                        <option value='price-desc'>Prix décroissant</option>
                    </select>
                </div>

                <div className={styles.content}>
                    <FilterSidebar
                        categories={categories}
                        selectedCategory={categoryId}
                        onCategoryChange={setCategoryId}
                        priceRange={priceRange}
                        onPriceRangeChange={setPriceRange}
                    />

                    <div className={styles.grid}>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
                        ) : filteredProducts.length === 0 ? (
                            <div className={styles.empty}>
                                Aucun produit disponible avec les filtres sélectionnés.
                            </div>
                        ) : (
                            filteredProducts.map(product => {
                                const category = categoryDict[product.categoryId];
                                if (!category) {
                                    return null;
                                }

                                return (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        preview={product.preview}
                                        category={category}
                                        customizable={false}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};
