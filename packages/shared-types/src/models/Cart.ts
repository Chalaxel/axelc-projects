export interface CartItem {
  id: string; // ID unique pour l'item dans le panier
  productId: string;
  productName: string;
  productPrice: number;
  variantId: string;
  variantName: string;
  variantImageBase64?: string;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: Date;
}

export interface AddToCartParams {
  productId: string;
  productName: string;
  productPrice: number;
  variantId: string;
  variantName: string;
  variantImageBase64?: string;
  quantity?: number;
}

