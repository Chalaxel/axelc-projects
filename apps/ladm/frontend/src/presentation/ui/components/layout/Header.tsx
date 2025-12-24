import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './Header.module.css';
import logo from '../../../../assets/logo.svg';
import { CartIcon } from '../cart/CartIcon';

export const Header: React.FC = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const isActive = (path: string) => location.pathname.includes(path);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 500) {
                return;
            }
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <header className={`${styles.header} ${isVisible ? styles.visible : styles.hidden}`}>
            <div className={styles.logoContainer}>
                <Link to='/ladm/home' className={styles.logoLink}>
                    <img src={logo} alt='Logo' className={styles.logo} />
                    <h1>L'Atelier de Mathilde</h1>
                </Link>
            </div>
            <nav className={styles.nav}>
                <Link to='/ladm/home' className={isActive('/home') ? styles.active : ''}>
                    Accueil
                </Link>
                <Link to='/ladm/actualites' className={isActive('/actualites') ? styles.active : ''}>
                    Actualités
                </Link>
                <Link to='/ladm/products' className={isActive('/products') ? styles.active : ''}>
                    Produits
                </Link>
                <Link
                    to='/ladm/personalisation'
                    className={isActive('/personalisation') ? styles.active : ''}
                >
                    Personnalisation
                </Link>
                <Link to='/ladm/contact' className={isActive('/contact') ? styles.active : ''}>
                    Contact
                </Link>
                <CartIcon />
            </nav>
        </header>
    );
};
