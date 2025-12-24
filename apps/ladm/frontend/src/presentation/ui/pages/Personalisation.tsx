import React from 'react';
import { useQuery } from '@tanstack/react-query';

import styles from './Personalisation.module.css';
import { Container } from '../components/layout/Container';
import { pageService } from '../../../services/pageService';
import { Page } from '@monorepo/shared-types';

export const Personalisation: React.FC = () => {
    const {
        data: page,
        isLoading,
        isError,
    } = useQuery<Page>({
        queryKey: ['page', 'personnalisation'],
        queryFn: () => pageService.getPageBySlug('personnalisation'),
    });

    if (isLoading) {
        return (
            <div className={styles.personalisation}>
                <div className={styles.loading}>Chargement...</div>
            </div>
        );
    }

    if (isError || !page) {
        return (
            <div className={styles.personalisation}>
                <div className={styles.error}>
                    Une erreur est survenue lors du chargement de la page.
                </div>
            </div>
        );
    }

    const pdfBase64 = page.metadata?.pdfBase64;
    const pdfName = page.metadata?.pdfName || 'catalogue-motifs.pdf';

    return (
        <div className={styles.personalisation}>
            <section className={styles.hero}>
                <Container>
                    <h1>{page.title}</h1>
                    <p className={styles.subtitle}>
                        Donnez vie à vos idées avec la technique du point de croix
                    </p>
                </Container>
            </section>

            <Container>
                <section className={styles.mainContent}>
                    <div className={styles.infoCard}>
                        <h2>La technique du point de croix</h2>
                        <p>
                            La personnalisation est faite à la main, avec la technique du point de
                            croix. Chaque création est unique et réalisée avec soin pour vous offrir
                            un article personnalisé de qualité.
                        </p>
                        {pdfBase64 && (
                            <a
                                href={pdfBase64}
                                download={pdfName}
                                className={styles.downloadButton}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                >
                                    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                                    <polyline points='7 10 12 15 17 10' />
                                    <line x1='12' y1='15' x2='12' y2='3' />
                                </svg>
                                Télécharger le catalogue des motifs (PDF)
                            </a>
                        )}
                    </div>

                    <div
                        className={styles.dynamicContent}
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />

                    <div className={styles.contactCard}>
                        <h2>Prêt à personnaliser votre article ?</h2>
                        <p>Contactez-moi pour discuter de votre projet !</p>
                        <div className={styles.contactButtons}>
                            <a
                                href='mailto:latelierdemathilde@yahoo.com'
                                className={styles.contactButton}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                >
                                    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
                                    <polyline points='22,6 12,13 2,6' />
                                </svg>
                                Email
                            </a>
                            <a
                                href='https://www.facebook.com/messages/t/103871279395091'
                                target='_blank'
                                rel='noopener noreferrer'
                                className={styles.contactButton}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                >
                                    <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
                                </svg>
                                Messenger
                            </a>
                        </div>
                    </div>
                </section>
            </Container>
        </div>
    );
};
