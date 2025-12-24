import React from 'react';
import styles from './ProductCardSkeleton.module.css';

export const ProductCardSkeleton: React.FC = () => (
    <div className={styles.cardSkeleton}>
        <div className={styles.imageSkeleton} />
        <div className={styles.contentSkeleton}>
            <div className={styles.titleSkeleton} />
            <div className={styles.priceSkeleton} />
        </div>
    </div>
);
