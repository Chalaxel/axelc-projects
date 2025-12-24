import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import styles from './FeaturedArticle.module.css';
import { Container } from '../layout/Container';
import { articleService } from '../../../../services/articleService';
import { Article } from '@monorepo/shared-types';

export const FeaturedArticle: React.FC = () => {
    const { data: article, isLoading } = useQuery<Article | null>({
        queryKey: ['featured-article'],
        queryFn: articleService.getFeaturedArticle,
    });

    if (isLoading) {
        return (
            <section className={styles.featuredArticle}>
                <Container>
                    <div className={styles.skeleton}>
                        <div className={styles.skeletonImage} />
                        <div className={styles.skeletonContent}>
                            <div className={styles.skeletonTitle} />
                            <div className={styles.skeletonText} />
                            <div className={styles.skeletonText} />
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    if (!article) {
        return null;
    }

    const formattedDate = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : null;

    return (
        <section className={styles.featuredArticle}>
            <Container>
                <h2>Dernière Actualité</h2>
                <Link to={`/actualites/${article.slug}`} className={styles.articleCard}>
                    {article.imageUrl && (
                        <div className={styles.imageContainer}>
                            <img src={article.imageUrl} alt={article.title} />
                        </div>
                    )}
                    <div className={styles.content}>
                        <div className={styles.meta}>
                            <span className={styles.category}>{article.category}</span>
                            {formattedDate && <span className={styles.date}>{formattedDate}</span>}
                        </div>
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <span className={styles.readMore}>Lire la suite →</span>
                    </div>
                </Link>
                <div className={styles.viewAllContainer}>
                    <Link to="/ladm/actualites" className={styles.viewAllLink}>
                        Voir toutes les actualités
                    </Link>
                </div>
            </Container>
        </section>
    );
};
