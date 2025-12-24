import { Link } from 'react-router-dom';
import { Category } from '@monorepo/shared-types';

import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        categoryId: string;
    };
    preview?: string | undefined;
    category: Category;
    customizable?: boolean;
}

export const ProductCard = ({
    product,
    preview,
    category,
    customizable = false,
}: ProductCardProps) => {
    if (!product || !category) {
        return null;
    }

    return (
        <article className={styles.card}>
            <Link to={`/products/${product.id}/variants`} className={styles.imageContainer}>
                {preview ? (
                    <img src={preview} alt={product.name} />
                ) : (
                    <div className={styles.noImage}>Aucune image</div>
                )}
                {customizable && <span className={styles.customizableBadge}>Personnalisable</span>}
            </Link>
            <div className={styles.content}>
                <span className={styles.category}>{category.name}</span>
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

// Export avec l'ancien nom pour compatibilité
export const ArticleTypeCard = ProductCard;
