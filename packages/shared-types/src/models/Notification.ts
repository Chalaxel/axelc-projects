export type NotificationType = 
  | 'new_order'           // Nouvelle commande
  | 'payment_received'    // Paiement reçu
  | 'order_cancelled';    // Commande annulée

export interface Notification {
  id: string;
  orderId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationCreationAttributes {
  orderId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead?: boolean;
}

