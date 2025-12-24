import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { Container } from '../components/layout/Container';
import { pageService } from '../../../services/pageService';
import { Page } from '@monorepo/shared-types';
import styles from './CGV.module.css';

export const CGVPage: React.FC = () => {
    const { data: page, isLoading, isError } = useQuery<Page>({
        queryKey: ['page', 'cgv'],
        queryFn: () => pageService.getPageBySlug('cgv'),
    });

    if (isLoading) {
        return (
            <div className={styles.cgv}>
                <Container>
                    <div className={styles.loading}>Chargement...</div>
                </Container>
            </div>
        );
    }

    if (isError || !page) {
        return (
            <div className={styles.cgv}>
                <Container>
                    <div className={styles.error}>
                        Une erreur est survenue lors du chargement des CGV.
                    </div>
                </Container>
            </div>
        );
    }

    const sanitizedContent = DOMPurify.sanitize(page.content, {
        ADD_TAGS: ['style'],
    });

    return (
        <div className={styles.cgv}>
            <Container>
                <h1 className={styles.title}>{page.title}</h1>
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
            </Container>
        </div>
    );
};
