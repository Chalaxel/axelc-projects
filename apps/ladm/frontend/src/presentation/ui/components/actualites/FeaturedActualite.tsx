import React from 'react';
import { Link } from 'react-router-dom';

import styles from './FeaturedActualite.module.css';

interface FeaturedActualiteProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  category: string;
}

export const FeaturedActualite: React.FC<FeaturedActualiteProps> = ({
  id,
  title,
  description,
  imageUrl,
  date,
  category,
}) => {
  return (
    <article className={styles.featured}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} />
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{category}</span>
        <div className={styles.date}>{date}</div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <Link to={`/actualites/${id}`} className={styles.readMore}>
          Lire l'article complet →
        </Link>
      </div>
    </article>
  );
};
