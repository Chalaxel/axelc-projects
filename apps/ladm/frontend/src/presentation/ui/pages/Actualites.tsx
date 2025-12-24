import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@monorepo/shared-types';

import styles from './Actualites.module.css';
import { ActualiteCard } from '../components/actualites/ActualiteCard';
import { FeaturedActualite } from '../components/actualites/FeaturedActualite';
import { Container } from '../components/layout/Container';
import { articleService } from '../../../services/articleService';

const DEFAULT_CATEGORIES = ['Tous', 'Événements', 'Nouveautés', 'Ateliers', 'Conseils'];

function formatDate(date: Date | string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export const Actualites: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('Tous');

    const { data: articles = [], isLoading } = useQuery<Article[]>({
        queryKey: ['articles'],
        queryFn: articleService.getAllArticles,
    });

    const categories = useMemo(() => {
        const articleCategories = [...new Set(articles.map(a => a.category))];
        return ['Tous', ...articleCategories.filter(c => !DEFAULT_CATEGORIES.slice(1).includes(c)), ...DEFAULT_CATEGORIES.slice(1).filter(c => articleCategories.includes(c))];
    }, [articles]);

    const uniqueCategories = useMemo(() => {
        const seen = new Set<string>();
        return categories.filter(cat => {
            if (seen.has(cat)) return false;
            seen.add(cat);
            return true;
        });
    }, [categories]);

    const featuredArticle = useMemo(() => {
        return articles.find(a => a.isFeatured) || articles[0];
    }, [articles]);

    const filteredArticles = useMemo(() => {
        const filtered = articles.filter(
            article => selectedCategory === 'Tous' || article.category === selectedCategory,
        );
        if (featuredArticle) {
            return filtered.filter(a => a.id !== featuredArticle.id);
        }
        return filtered;
    }, [articles, selectedCategory, featuredArticle]);

    if (isLoading) {
        return (
            <div className={styles.actualites}>
                <Container>
                    <h1 className={styles.pageTitle}>Actualités</h1>
                    <div className={styles.loading}>Chargement des articles...</div>
                </Container>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className={styles.actualites}>
                <Container>
                    <h1 className={styles.pageTitle}>Actualités</h1>
                    <div className={styles.empty}>Aucun article pour le moment.</div>
                </Container>
            </div>
        );
    }

    return (
        <div className={styles.actualites}>
            <Container>
                <h1 className={styles.pageTitle}>Actualités</h1>
                {featuredArticle && (
                    <FeaturedActualite
                        id={featuredArticle.id}
                        title={featuredArticle.title}
                        description={featuredArticle.description}
                        imageUrl={featuredArticle.imageUrl || '/assets/images/placeholder.jpg'}
                        date={formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}
                        category={featuredArticle.category}
                    />
                )}

                <div className={styles.categories}>
                    {uniqueCategories.map(category => (
                        <button
                            key={category}
                            className={`${styles.categoryButton} ${
                                selectedCategory === category ? styles.active : ''
                            }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {filteredArticles.map(article => (
                        <ActualiteCard
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            description={article.description}
                            imageUrl={article.imageUrl || '/assets/images/placeholder.jpg'}
                            date={formatDate(article.publishedAt || article.createdAt)}
                            category={article.category}
                        />
                    ))}
                </div>
            </Container>
        </div>
    );
};
