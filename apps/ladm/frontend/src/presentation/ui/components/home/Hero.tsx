import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Hero.module.css';

export const Hero: React.FC = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h1 className={styles.title}>L'Atelier de Mathilde</h1>
                <p className={styles.subtitle}>Créations artisanales uniques et personnalisées</p>
                <p className={styles.description}>
                    Découvrez des pièces uniques fabriquées avec passion et savoir-faire
                </p>
                <div className={styles.buttons}>
                    <Link to='/ladm/products' className={styles.primaryButton}>
                        Découvrir nos créations
                    </Link>
                    <Link to='/ladm/personalisation' className={styles.secondaryButton}>
                        Personnaliser
                    </Link>
                </div>
            </div>
            <div className={styles.scrollIndicator}>
                <span>Découvrir</span>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                >
                    <path d='M12 5v14M5 12l7 7 7-7' />
                </svg>
            </div>
        </section>
    );
};
