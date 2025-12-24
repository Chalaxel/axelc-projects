import React, { createContext, useContext, ReactNode } from 'react';
import { Cart, CartItem, AddToCartParams } from '@monorepo/shared-types';
import { useCart } from '../hooks/useCart';

interface CartContextType {
    cart: Cart;
    items: CartItem[];
    addToCart: (params: AddToCartParams) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (productId: string, variantId: string) => number;
    isInCart: (productId: string, variantId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const cartMethods = useCart();

    return (
        <CartContext.Provider value={cartMethods}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};

