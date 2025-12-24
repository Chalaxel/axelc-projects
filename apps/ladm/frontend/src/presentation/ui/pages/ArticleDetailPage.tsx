import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { Article } from '@monorepo/shared-types';

import styles from './ArticleDetailPage.module.css';
import { Container } from '../components/layout/Container';
import { articleService } from '../../../services/articleService';

function formatDate(date: Date | string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export const ArticleDetailPage: React.FC = () => {
    const { articleId } = useParams<{ articleId: string }>();

    const {
        data: article,
        isLoading,
        error,
    } = useQuery<Article>({
        queryKey: ['article', articleId],
        queryFn: () => articleService.getArticleById(articleId!),
        enabled: !!articleId,
    });

    if (isLoading) {
        return (
            <div className={styles.articlePage}>
                <Container>
                    <div className={styles.loading}>Chargement de l'article...</div>
                </Container>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className={styles.articlePage}>
                <Container>
                    <Link to='/ladm/actualites' className={styles.backLink}>
                        ← Retour aux actualités
                    </Link>
                    <div className={styles.error}>Article non trouvé.</div>
                </Container>
            </div>
        );
    }

    const sanitizedContent = DOMPurify.sanitize(article.content);

    return (
        <div className={styles.articlePage}>
            <Container>
                <Link to='/ladm/actualites' className={styles.backLink}>
                    ← Retour aux actualités
                </Link>

                {article.imageUrl ? (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className={styles.heroImage}
                    />
                ) : (
                    <div className={styles.noImage}>
                        <span className={styles.noImageIcon}>📰</span>
                    </div>
                )}

                <div className={styles.meta}>
                    <span className={styles.category}>{article.category}</span>
                    <span className={styles.date}>
                        {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                </div>

                <h1 className={styles.title}>{article.title}</h1>

                <p className={styles.description}>{article.description}</p>

                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
            </Container>
        </div>
    );
};
