import React from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import { Container } from '../components/layout/Container';
import styles from './CartPage.module.css';

export const CartPage: React.FC = () => {
    const { cart, items, removeFromCart, updateQuantity, clearCart } = useCartContext();

    if (items.length === 0) {
        return (
            <div className={styles.cart}>
                <Container>
                    <h1 className={styles.pageTitle}>Mon Panier</h1>
                    <div className={styles.emptyCart}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='80'
                            height='80'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        >
                            <circle cx='9' cy='21' r='1' />
                            <circle cx='20' cy='21' r='1' />
                            <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
                        </svg>
                        <h2>Votre panier est vide</h2>
                        <p>Ajoutez des produits pour commencer votre commande</p>
                        <Link to='/ladm/products' className={styles.continueButton}>
                            Découvrir nos produits
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className={styles.cart}>
            <Container>
                <div className={styles.header}>
                    <h1 className={styles.pageTitle}>Mon Panier</h1>
                    <button onClick={clearCart} className={styles.clearButton}>
                        Vider le panier
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.itemsList}>
                        {items.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.itemImage}>
                                    {item.variantImageBase64 ? (
                                        <img src={item.variantImageBase64} alt={item.variantName} />
                                    ) : (
                                        <div className={styles.placeholderImage}>
                                            {item.variantName}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.itemDetails}>
                                    <h3 className={styles.productName}>
                                        {item.productName}
                                        {item.quantity > 1 && (
                                            <span className={styles.quantityBadge}>
                                                x{item.quantity}
                                            </span>
                                        )}
                                    </h3>
                                    <p className={styles.variantName}>{item.variantName}</p>
                                    <p className={styles.unitPrice}>
                                        {(item.productPrice / 100).toFixed(2)} € / unité
                                    </p>
                                </div>

                                <div className={styles.itemActions}>
                                    <p className={styles.itemTotal}>
                                        {((item.productPrice * item.quantity) / 100).toFixed(2)} €
                                    </p>

                                    <div className={styles.actionButtons}>
                                        {item.quantity > 1 && (
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity - 1)
                                                }
                                                className={styles.decrementButton}
                                                aria-label='Retirer un exemplaire'
                                            >
                                                -1
                                            </button>
                                        )}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className={styles.removeButton}
                                            aria-label='Supprimer du panier'
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summary}>
                        <h2 className={styles.summaryTitle}>Récapitulatif</h2>

                        <div className={styles.summaryLine}>
                            <span>Articles ({cart.totalItems})</span>
                            <span>{(cart.totalPrice / 100).toFixed(2)} €</span>
                        </div>

                        <div className={styles.summaryLine}>
                            <span>Livraison</span>
                            <span>À calculer</span>
                        </div>

                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>{(cart.totalPrice / 100).toFixed(2)} €</span>
                        </div>

                        <Link to='/ladm/checkout' className={styles.checkoutButton}>
                            Passer la commande
                        </Link>

                        <p className={styles.cgvNote}>
                            En passant commande, vous acceptez nos{' '}
                            <Link to='/ladm/cgv' className={styles.cgvLink}>
                                Conditions Générales de Vente
                            </Link>
                        </p>

                        <Link to='/ladm/products' className={styles.continueShoppingLink}>
                            Continuer mes achats
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
};
