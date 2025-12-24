import React from 'react';
import { Container } from '../components/layout/Container';
import styles from './ProductVariantsPageSkeleton.module.css';

export const ProductVariantsPageSkeleton: React.FC = () => {
    return (
        <div className={styles.skeleton}>
            <Container>
                <div className={`${styles.titleSkeleton} ${styles.shimmer}`} />

                <div className={styles.mainContentSkeleton}>
                    <div className={`${styles.imageSkeleton} ${styles.shimmer}`} />
                    <div className={styles.infoSkeleton}>
                        <div className={`${styles.line1} ${styles.shimmer}`} />
                        <div className={`${styles.line2} ${styles.shimmer}`} />
                        <div className={`${styles.line3} ${styles.shimmer}`} />
                        <div className={`${styles.buttonSkeleton} ${styles.shimmer}`} />
                    </div>
                </div>

                <div className={`${styles.otherVariantsTitleSkeleton} ${styles.shimmer}`} />
                <div className={styles.miniGrid}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={styles.miniCardSkeleton}>
                            <div className={`${styles.miniImage} ${styles.shimmer}`} />
                            <div className={`${styles.miniName} ${styles.shimmer}`} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};
