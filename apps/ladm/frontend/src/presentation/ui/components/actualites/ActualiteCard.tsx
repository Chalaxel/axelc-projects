import React from 'react';
import { Link } from 'react-router-dom';

import styles from './ActualiteCard.module.css';

interface ActualiteCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  category: string;
}

export const ActualiteCard: React.FC<ActualiteCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  date,
  category,
}) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} />
        <span className={styles.category}>{category}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.date}>{date}</div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Link to={`/actualites/${id}`} className={styles.readMore}>
          Lire la suite →
        </Link>
      </div>
    </article>
  );
};
