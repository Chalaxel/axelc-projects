import React from 'react';

import styles from './ExampleCard.module.css';

interface ExampleCardProps {
  imageUrl: string;
  title: string;
  description: string;
  category: string;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({
  imageUrl,
  title,
  description,
  category,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} />
        <span className={styles.category}>{category}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};
