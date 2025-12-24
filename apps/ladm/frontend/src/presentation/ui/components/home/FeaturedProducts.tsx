import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import styles from './FeaturedProducts.module.css';
import { Container } from '../layout/Container';
import { productService, ProductWithPreview } from '../../../../services/productService';
import { ProductCardSkeleton } from '../products/ProductCardSkeleton';

interface ProductCardProps {
    product: ProductWithPreview;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const imageUrl = product.preview;


    return (
        <Link to={`/products/${product.id}/variants`} className={styles.card}>
            <div className={styles.imageContainer}>
                {imageUrl ? (
                    <img src={imageUrl} alt={product.name} />
                ) : (
                    <div className={styles.placeholderImage}>
                        <span>{product.name.charAt(0)}</span>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3>{product.name}</h3>
                <div className={styles.price}>{(product.price / 100).toFixed(2)} €</div>
            </div>
        </Link>
    );
};



export const FeaturedProducts: React.FC = () => {
    const { data: products, isLoading } = useQuery<ProductWithPreview[]>({
        queryKey: ['products-available-with-variants'],
        queryFn: productService.getAllProductsWithVariants,
    });

    if (isLoading) {
        return (
            <section className={styles.featured}>
                <Container>
                    <h2>Nos Créations</h2>
                    <div className={styles.grid}>
                        {[1, 2, 3].map(i => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </Container>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    const displayProducts = products.slice(0, 6);

    return (
        <section className={styles.featured}>
            <Container>
                <h2>Nos Créations</h2>
                <div className={styles.grid}>
                    {displayProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className={styles.viewAllContainer}>
                    <Link to='/ladm/products' className={styles.viewAllButton}>
                        Voir tous les produits
                    </Link>
                </div>
            </Container>
        </section>
    );
};
