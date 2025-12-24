import React, { useState, useEffect } from 'react';
import styles from './AdminPage.module.css';
import { ProductsManagement } from '../components/admin/ProductsManagement';
import { VariantsManagement } from '../components/admin/VariantsManagement';
import { CategoriesManagement } from '../components/admin/CategoriesManagement';
import { OrdersManagement } from '../components/admin/OrdersManagement';
import { SalesDashboard } from '../components/admin/SalesDashboard';
import { ArticlesManagement } from '../components/admin/ArticlesManagement';
import { CGVManagement } from '../components/admin/CGVManagement';
import { PersonnalisationManagement } from '../components/admin/PersonnalisationManagement';
import { NotificationCenter } from '../components/notifications/NotificationCenter';

type TabType =
    | 'categories'
    | 'products'
    | 'variants'
    | 'orders'
    | 'dashboard'
    | 'articles'
    | 'cgv'
    | 'personnalisation';

const ADMIN_ACCESS_CODE = 'ladm2024';
const SESSION_KEY = 'admin_authenticated';

const MENU_ITEMS: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'orders', label: 'Commandes', icon: '📦' },
    { id: 'categories', label: 'Catégories', icon: '🏷️' },
    { id: 'products', label: 'Produits', icon: '🛍️' },
    { id: 'variants', label: 'Variantes', icon: '🎨' },
    { id: 'articles', label: 'Articles', icon: '📝' },
    { id: 'cgv', label: 'CGV', icon: '📄' },
    { id: 'personnalisation', label: 'Personnalisation', icon: '✨' },
];

export const AdminPage = () => {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const authenticated = sessionStorage.getItem(SESSION_KEY);
        if (authenticated === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode === ADMIN_ACCESS_CODE) {
            setIsAuthenticated(true);
            sessionStorage.setItem(SESSION_KEY, 'true');
            setError('');
        } else {
            setError("Code d'accès incorrect");
            setAccessCode('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.accessContainer}>
                <div className={styles.accessCard}>
                    <h2 className={styles.accessTitle}>Accès restreint</h2>
                    <p className={styles.accessSubtitle}>Veuillez entrer le code d'accès</p>
                    <form onSubmit={handleSubmit} className={styles.accessForm}>
                        <input
                            type='password'
                            value={accessCode}
                            onChange={e => setAccessCode(e.target.value)}
                            placeholder="Code d'accès"
                            className={styles.accessInput}
                            autoFocus
                        />
                        {error && <p className={styles.accessError}>{error}</p>}
                        <button type='submit' className={styles.accessButton}>
                            Accéder
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const activeMenuItem = MENU_ITEMS.find(item => item.id === activeTab);

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Administration</h2>
                </div>
                <nav className={styles.sidebarNav}>
                    {MENU_ITEMS.map(item => (
                        <button
                            key={item.id}
                            className={`${styles.sidebarItem} ${activeTab === item.id ? styles.sidebarItemActive : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span className={styles.sidebarIcon}>{item.icon}</span>
                            <span className={styles.sidebarLabel}>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <main className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <span className={styles.headerIcon}>{activeMenuItem?.icon}</span>
                        <h1 className={styles.title}>{activeMenuItem?.label}</h1>
                    </div>
                    <NotificationCenter />
                </div>

                <div className={styles.content}>
                    {activeTab === 'dashboard' && <SalesDashboard />}
                    {activeTab === 'orders' && <OrdersManagement />}
                    {activeTab === 'categories' && <CategoriesManagement />}
                    {activeTab === 'products' && <ProductsManagement />}
                    {activeTab === 'variants' && <VariantsManagement />}
                    {activeTab === 'articles' && <ArticlesManagement />}
                    {activeTab === 'cgv' && <CGVManagement />}
                    {activeTab === 'personnalisation' && <PersonnalisationManagement />}
                </div>
            </main>
        </div>
    );
};
