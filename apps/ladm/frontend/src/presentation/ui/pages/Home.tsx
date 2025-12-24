import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Home.module.css';
import { Categories } from '../components/home/Categories';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { FeaturedArticle } from '../components/home/FeaturedArticle';
import { Hero } from '../components/home/Hero';
import { Container } from '../components/layout/Container';

export const Home: React.FC = () => {
    return (
        <div className={styles.home}>
            <Hero />
            <FeaturedProducts />
            <Categories />
            <FeaturedArticle />
            <section className={styles.about}>
                <Container>
                    <div className={styles.aboutContent}>
                        <div className={styles.aboutText}>
                            <h2>À propos de l'Atelier</h2>
                            <p>
                                Bienvenue dans mon univers créatif où chaque pièce est unique et
                                fabriquée avec passion. Spécialisée dans la création d'objets
                                personnalisés avec la technique du point de croix, je mets tout mon
                                savoir-faire à votre service pour créer des pièces qui vous
                                ressemblent.
                            </p>
                            <p>
                                Chaque création est réalisée à la main avec soin et attention aux
                                détails, pour vous offrir des articles uniques et de qualité.
                            </p>
                            <Link to='/ladm/personalisation' className={styles.aboutLink}>
                                En savoir plus sur la personnalisation →
                            </Link>
                        </div>
                        <div className={styles.aboutHighlights}>
                            <div className={styles.highlight}>
                                <span className={styles.highlightIcon}>✋</span>
                                <h3>Fait main</h3>
                                <p>Chaque pièce est créée artisanalement</p>
                            </div>
                            <div className={styles.highlight}>
                                <span className={styles.highlightIcon}>🎨</span>
                                <h3>Personnalisable</h3>
                                <p>Adaptée à vos envies et besoins</p>
                            </div>
                            <div className={styles.highlight}>
                                <span className={styles.highlightIcon}>💝</span>
                                <h3>Unique</h3>
                                <p>Des créations qui vous ressemblent</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
};
