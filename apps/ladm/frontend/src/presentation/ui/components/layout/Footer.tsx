import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.section}>
                    <h3>L'Atelier de Mathilde</h3>
                    <p>Créations artisanales en couture</p>
                </div>

                <div className={styles.section}>
                    <h4>Navigation</h4>
                    <nav className={styles.links}>
                        <Link to='/ladm/home'>Accueil</Link>
                        <Link to='/ladm/products'>Produits</Link>
                        <Link to='/ladm/actualites'>Actualités</Link>
                        <Link to='/ladm/contact'>Contact</Link>
                    </nav>
                </div>

                <div className={styles.section}>
                    <h4>Informations légales</h4>
                    <nav className={styles.links}>
                        <Link to='/ladm/cgv'>Conditions Générales de Vente</Link>
                    </nav>
                </div>

                <div className={styles.section}>
                    <h4>Contact</h4>
                    <p>2 chemin des Croix</p>
                    <p>42560 GUMIERES</p>
                    <a href='mailto:latelierdemathilde@yahoo.com' className={styles.email}>
                        latelierdemathilde@yahoo.com
                    </a>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>
                    &copy; {new Date().getFullYear()} L'Atelier de Mathilde. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
};
