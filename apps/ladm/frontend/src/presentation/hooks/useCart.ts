import { useState, useEffect, useCallback } from 'react';
import { CartItem, Cart, AddToCartParams } from '@monorepo/shared-types';

const CART_STORAGE_KEY = 'ladm_cart';

const calculateCart = (items: CartItem[]): Cart => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
    
    return {
        items,
        totalItems,
        totalPrice,
        updatedAt: new Date(),
    };
};

const loadCartFromStorage = (): CartItem[] => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (!stored) return [];
        
        const items = JSON.parse(stored) as CartItem[];
        // Reconvertir les dates
        return items.map(item => ({
            ...item,
            addedAt: new Date(item.addedAt),
        }));
    } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        return [];
    }
};

const saveCartToStorage = (items: CartItem[]) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error);
    }
};

export const useCart = () => {
    const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

    // Sauvegarder automatiquement dans localStorage à chaque changement
    useEffect(() => {
        saveCartToStorage(items);
    }, [items]);

    // Ajouter un article au panier
    const addToCart = useCallback((params: AddToCartParams) => {
        setItems(currentItems => {
            // Vérifier si l'item existe déjà (même produit + même variante)
            const existingItemIndex = currentItems.findIndex(
                item => item.productId === params.productId && item.variantId === params.variantId
            );

            if (existingItemIndex >= 0) {
                // Incrémenter la quantité
                const newItems = [...currentItems];
                const existingItem = newItems[existingItemIndex];
                if (existingItem) {
                    newItems[existingItemIndex] = {
                        ...existingItem,
                        quantity: existingItem.quantity + (params.quantity || 1),
                    };
                }
                return newItems;
            } else {
                // Ajouter un nouvel item
                const newItem: CartItem = {
                    id: `${params.productId}-${params.variantId}-${Date.now()}`,
                    productId: params.productId,
                    productName: params.productName,
                    productPrice: params.productPrice,
                    variantId: params.variantId,
                    variantName: params.variantName,
                    ...(params.variantImageBase64 && { variantImageBase64: params.variantImageBase64 }),
                    quantity: params.quantity || 1,
                    addedAt: new Date(),
                };
                return [...currentItems, newItem];
            }
        });
    }, []);

    // Retirer un article du panier
    const removeFromCart = useCallback((itemId: string) => {
        setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    }, []);

    // Mettre à jour la quantité d'un article
    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setItems(currentItems => 
            currentItems.map(item => 
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    }, [removeFromCart]);

    // Vider le panier
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    // Obtenir la quantité d'un produit+variante spécifique
    const getItemQuantity = useCallback((productId: string, variantId: string): number => {
        const item = items.find(
            item => item.productId === productId && item.variantId === variantId
        );
        return item?.quantity || 0;
    }, [items]);

    // Vérifier si un produit+variante est dans le panier
    const isInCart = useCallback((productId: string, variantId: string): boolean => {
        return items.some(
            item => item.productId === productId && item.variantId === variantId
        );
    }, [items]);

    const cart = calculateCart(items);

    return {
        cart,
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
    };
};

