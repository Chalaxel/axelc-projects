import { Route, Routes, Navigate } from 'react-router-dom';

import appStyles from './App.module.css';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Actualites } from './pages/Actualites';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductVariantsPage } from './pages/ProductVariantsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderPaymentPage } from './pages/OrderPaymentPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { CGVPage } from './pages/CGVPage';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { Personalisation } from './pages/Personalisation';
import { AdminPage } from './pages/AdminPage';
import '../theme/global.css';
import { CartProvider } from '../context/CartContext';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path='home' element={<Home />} />
            <Route path='actualites' element={<Actualites />} />
            <Route path='actualites/:articleId' element={<ArticleDetailPage />} />
            <Route path='products'>
                <Route index element={<ProductsPage />} />
                <Route path=':productId/variants' element={<ProductVariantsPage />} />
            </Route>
            <Route path='personalisation' element={<Personalisation />} />
            <Route path='cart' element={<CartPage />} />
            <Route path='checkout' element={<CheckoutPage />} />
            <Route path='order/:orderId/payment' element={<OrderPaymentPage />} />
            <Route path='order-confirmation/:orderId' element={<OrderConfirmationPage />} />
            <Route path='cgv' element={<CGVPage />} />
            <Route path='contact' element={<Contact />} />
            <Route path='backstage-gestion-7k9x' element={<AdminPage />} />
            <Route index element={<Navigate to='home' replace />} />
            <Route path='*' element={<Navigate to='home' replace />} />
        </Routes>
    );
};

export const App = () => {
    return (
        <CartProvider>
            <div className={appStyles.root}>
                <Header />
                <main className={appStyles.main}>
                    <AppRoutes />
                </main>
                <Footer />
            </div>
        </CartProvider>
    );
};
