import { Product } from './Product';
import { ProductVariant } from './ProductVariant';

export type OrderStatus = 
  | 'pending_validation'         // En attente de validation admin
  | 'validated_awaiting_payment' // Validée, en attente de paiement client
  | 'pending'                    // En attente de paiement (legacy)
  | 'paid'                       // Payé
  | 'preparing'                  // En préparation
  | 'shipped'                    // Expédié
  | 'delivered'                  // Livré
  | 'cancelled';                 // Annulé

export type PaymentMethod = 
  | 'sumup_online'    // Paiement en ligne via SumUp
  | 'sumup_physical'; // Paiement physique avec terminal SumUp

export type DeliveryMethod = 'mondial_relay';

// Point relais Mondial Relay sélectionné par le client
export interface MondialRelayPoint {
  id: string;           // ID du point relais (ex: "FR-12345")
  name: string;         // Nom du point relais
  address: string;      // Adresse du point relais
  city: string;         // Ville
  postalCode: string;   // Code postal
  country: string;      // Code pays (FR, BE, etc.)
  latitude?: string;    // Latitude pour affichage carte
  longitude?: string;   // Longitude pour affichage carte
}

// Informations de facturation simplifiées
export interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  trackingNumber?: string;
  carrier?: string; // 'mondial_relay' | 'colissimo' | 'other'
  deliveryMethod?: DeliveryMethod;
  relayPoint?: MondialRelayPoint;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  price: number; // Prix au moment de la commande (snapshot)
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  // Relations optionnelles (peuplées via include)
  product?: Product;
  variant?: ProductVariant;
}

// Metadata flexible pour stocker des informations supplémentaires
export interface OrderMetadata {
  cancellationReason?: string; // Motif d'annulation (si annulée)
  [key: string]: unknown; // Permet d'ajouter d'autres champs à l'avenir
}

export interface Order {
  id: string;
  orderNumber: string; // Numéro de commande lisible (ex: ORD-2024-001)
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string; // ID de transaction SumUp
  checkoutId?: string; // ID du checkout SumUp (pour éviter les duplications)
  totalAmount: number; // Montant total en centimes
  shippingCost?: number; // Frais de livraison en centimes (ajoutés par admin)
  shippingInfo: ShippingInfo;
  items?: OrderItem[]; // Items inclus dans la commande
  notes?: string; // Notes internes du vendeur
  metadata?: OrderMetadata; // Données supplémentaires (motif d'annulation, etc.)
  validatedAt?: Date; // Date de validation par admin
  paymentLinkExpiresAt?: Date; // Date d'expiration du lien de paiement
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderCreationAttributes {
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  totalAmount: number;
  shippingInfo: ShippingInfo;
  notes?: string;
}

export interface CreateOrderRequest {
  cartItems: Array<{
    productId: string;
    variantId: string;
    price: number;
    quantity: number;
  }>;
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  // Nouveau flow avec Mondial Relay
  billingInfo?: BillingInfo;
  relayPoint?: MondialRelayPoint;
}

export interface ValidateOrderRequest {
  approved: boolean;
  shippingCost?: number; // Requis si approved = true
  refusalReason?: string; // Optionnel si approved = false
}

