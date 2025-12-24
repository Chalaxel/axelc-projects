import React from 'react';
import { ProductVariant } from '@monorepo/shared-types';
import styles from './VariantCard.module.css';

interface VariantCardProps {
  variant: ProductVariant;
  onSelect?: (variant: ProductVariant) => void;
}

export const VariantCard: React.FC<VariantCardProps> = ({ variant, onSelect }) => {
  const isAvailable = variant.status === 'available';

  const handleClick = () => {
    if (isAvailable && onSelect) {
      onSelect(variant);
    }
  };

  return (
    <article 
      className={`${styles.card} ${!isAvailable ? styles.unavailable : ''}`}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        {variant.imageBase64 ? (
          <img 
            src={variant.imageBase64} 
            alt={variant.name}
            className={styles.variantImage}
          />
        ) : (
          <div className={styles.placeholderImage}>
            <span>{variant.name}</span>
          </div>
        )}
        
        {!isAvailable && (
          <div className={styles.unavailableOverlay}>
            <span className={styles.unavailableLabel}>Indisponible</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{variant.name}</h3>
        
        <div className={styles.footer}>
          {isAvailable && onSelect && (
            <button className={styles.selectButton}>
              Sélectionner
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

