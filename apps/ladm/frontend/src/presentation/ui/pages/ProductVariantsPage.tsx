import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import styles from './ProductVariantsPage.module.css';

import { VariantCard } from '../components/variants/VariantCard';
import { Container } from '../components/layout/Container';
import { useProductWithVariants } from '../../hooks/useProductVariants';
import { useCartContext } from '../../context/CartContext';
import { ProductVariant } from '@monorepo/shared-types';
import { ProductVariantsPageSkeleton } from './ProductVariantsPageSkeleton';

export const ProductVariantsPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { product, isLoading, error } = useProductWithVariants(productId);
    const { addToCart, isInCart, getItemQuantity } = useCartContext();
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [showAddedMessage, setShowAddedMessage] = useState(false);
    const [stockError, setStockError] = useState<string | null>(null);

    useEffect(() => {
        if (product && product.variants && product.variants.length > 0 && !selectedVariant) {
            const firstAvailableVariant = product.variants.find(v => v.status === 'available');
            if (firstAvailableVariant) {
                setSelectedVariant(firstAvailableVariant);
            } else {
                const fallbackVariant = product.variants[0];
                if (fallbackVariant) {
                    setSelectedVariant(fallbackVariant);
                }
            }
        }
    }, [product, selectedVariant]);

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        setShowAddedMessage(false);
        setStockError(null);
    };

    const handleAddToCart = () => {
        if (!product || !selectedVariant) {
            return;
        }

        // Vérifier le stock disponible
        const currentInCart = getItemQuantity(product.id, selectedVariant.id);
        const availableStock = selectedVariant.stock - currentInCart;

        if (availableStock <= 0) {
            setStockError(
                'Stock insuffisant. Vous avez déjà ajouté tous les exemplaires disponibles.',
            );
            setTimeout(() => setStockError(null), 4000);
            return;
        }

        const cartParams = {
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            variantId: selectedVariant.id,
            variantName: selectedVariant.name,
            quantity: 1,
            variantImageBase64: '',
        };

        if (selectedVariant.imageBase64) {
            cartParams.variantImageBase64 = selectedVariant.imageBase64;
        }

        addToCart(cartParams);

        setShowAddedMessage(true);
        setStockError(null);
        setTimeout(() => setShowAddedMessage(false), 3000);
    };

    // Calculer si on peut encore ajouter au panier
    const canAddToCart = () => {
        if (!product || !selectedVariant) {
            return false;
        }
        if (selectedVariant.status !== 'available') {
            return false;
        }
        const currentInCart = getItemQuantity(product.id, selectedVariant.id);
        return selectedVariant.stock > currentInCart;
    };

    // Obtenir le stock restant disponible
    const getRemainingStock = () => {
        if (!product || !selectedVariant) {
            return 0;
        }
        const currentInCart = getItemQuantity(product.id, selectedVariant.id);
        return Math.max(0, selectedVariant.stock - currentInCart);
    };

    if (isLoading) {
        return <ProductVariantsPageSkeleton />;
    }

    if (error) {
        return (
            <div className={styles.variants}>
                <Container>
                    <div className={styles.error}>
                        <p>Erreur lors du chargement des variantes</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.variants}>
                <Container>
                    <div className={styles.error}>
                        <p>Produit non trouvé</p>
                    </div>
                </Container>
            </div>
        );
    }

    const variants = product.variants || [];
    const otherVariants = selectedVariant ? variants.filter(v => v.id !== selectedVariant.id) : [];

    return (
        <div className={styles.variants}>
            <Container>
                <div className={styles.pageTitleContainer}>
                    <Link to='/ladm/products' className={styles.backButton}>
                        ⬅
                    </Link>
                    <h1 className={styles.pageTitle}>{product.name}</h1>
                </div>

                {variants.length === 0 ? (
                    <div className={styles.noVariants}>
                        <p>Aucune variante disponible pour ce produit.</p>
                    </div>
                ) : (
                    <>
                        {selectedVariant ? (
                            <>
                                <div className={styles.mainContent}>
                                    <div className={styles.selectedVariantImage}>
                                        {selectedVariant.imageBase64 ? (
                                            <img
                                                src={selectedVariant.imageBase64}
                                                alt={selectedVariant.name}
                                                className={styles.largeImage}
                                            />
                                        ) : (
                                            <div className={styles.placeholderImage}>
                                                <span>{selectedVariant.name}</span>
                                            </div>
                                        )}
                                        {selectedVariant.status !== 'available' && (
                                            <div className={styles.unavailableOverlay}>
                                                <span className={styles.unavailableLabel}>
                                                    INDISPONIBLE
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.productInfo}>
                                        <div className={styles.infoHeader}>
                                            <h2 className={styles.variantName}>
                                                {selectedVariant.name}
                                            </h2>
                                            <p className={styles.productPrice}>
                                                {(product.price / 100).toFixed(2)} €
                                            </p>
                                        </div>

                                        <div className={styles.stockInfo}>
                                            {selectedVariant.status === 'available' ? (
                                                <span className={styles.stockAvailable}>
                                                    {getRemainingStock()} en stock
                                                </span>
                                            ) : (
                                                <span className={styles.stockUnavailable}>
                                                    Indisponible
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.addToCartSection}>
                                            <button
                                                onClick={handleAddToCart}
                                                className={styles.addToCartButton}
                                                disabled={!canAddToCart()}
                                            >
                                                {!canAddToCart() &&
                                                    selectedVariant.status === 'available'
                                                    ? 'Stock épuisé (déjà dans le panier)'
                                                    : isInCart(product.id, selectedVariant.id)
                                                        ? '✓ Ajouter à nouveau'
                                                        : '🛒 Ajouter au panier'}
                                            </button>

                                            {showAddedMessage && (
                                                <p className={styles.addedMessage}>
                                                    ✓ Ajouté au panier !
                                                </p>
                                            )}

                                            {stockError && (
                                                <p className={styles.stockError}>{stockError}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {otherVariants.length > 0 && (
                                    <div className={styles.otherVariantsSection}>
                                        <h3 className={styles.otherVariantsTitle}>
                                            Autres coloris disponibles
                                        </h3>
                                        <div className={styles.miniGrid}>
                                            {otherVariants.map(variant => (
                                                <div
                                                    key={variant.id}
                                                    className={`${styles.miniVariant} ${variant.status !== 'available' ? styles.miniUnavailable : ''}`}
                                                    onClick={() =>
                                                        variant.status === 'available' &&
                                                        handleVariantSelect(variant)
                                                    }
                                                >
                                                    {variant.imageBase64 ? (
                                                        <img
                                                            src={variant.imageBase64}
                                                            alt={variant.name}
                                                            className={styles.miniImage}
                                                        />
                                                    ) : (
                                                        <div className={styles.miniPlaceholder}>
                                                            {variant.name}
                                                        </div>
                                                    )}
                                                    <p className={styles.miniName}>
                                                        {variant.name}
                                                    </p>
                                                    {variant.status !== 'available' && (
                                                        <div
                                                            className={
                                                                styles.miniUnavailableOverlay
                                                            }
                                                        >
                                                            <span>Indisponible</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className={styles.sectionTitle}>
                                    <h2>Choisissez votre coloris</h2>
                                    <p className={styles.variantCount}>
                                        {variants.length} variante{variants.length > 1 ? 's' : ''}{' '}
                                        disponible{variants.length > 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className={styles.grid}>
                                    {variants.map(variant => (
                                        <VariantCard
                                            key={variant.id}
                                            variant={variant}
                                            onSelect={handleVariantSelect}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
};
