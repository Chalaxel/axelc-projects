import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@monorepo/shared-types';

import styles from './ProductCardSimple.module.css';

interface ProductCardSimpleProps {
    product: Product;
}

export const ProductCardSimple: React.FC<ProductCardSimpleProps> = ({ product }) => {
    if (!product) {
        return null;
    }

    return (
        <article className={styles.card}>
            <Link to={`/products/${product.id}/variants`} className={styles.imageContainer}>
                <img src='' alt={product.name} />
            </Link>
            <div className={styles.content}>
                <h3 className={styles.title}>{product.name}</h3>
                <div className={styles.footer}>
                    <span className={styles.price}>{(product.price / 100).toFixed(2)} €</span>
                    <Link to={`/products/${product.id}/variants`} className={styles.detailsButton}>
                        Voir les variantes
                    </Link>
                </div>
            </div>
        </article>
    );
};
