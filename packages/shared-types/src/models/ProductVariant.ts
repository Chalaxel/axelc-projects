export type ProductVariantStatus = 
  | 'available'   // Disponible à la vente
  | 'sold'        // Vendu
  | 'reserved';   // Réservé (commande en cours)

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  imageBase64?: string; // Image de la variante en base64
  status: ProductVariantStatus;
  stock: number; // Quantité en stock
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariantCreationAttributes {
  productId: string;
  name: string;
  imageBase64?: string;
  status?: ProductVariantStatus; // Par défaut 'available'
  stock?: number; // Par défaut 1
}

