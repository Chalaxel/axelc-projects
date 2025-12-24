import { Cart } from '@monorepo/shared-types';
import styles from './CheckoutSummary.module.css';

interface CheckoutSummaryProps {
    cart: Cart;
}

export const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Résumé de la commande</h2>

            <div className={styles.items}>
                {cart.items.map(item => (
                    <div key={item.id} className={styles.item}>
                        {item.variantImageBase64 && (
                            <img
                                src={item.variantImageBase64}
                                alt={item.variantName}
                                className={styles.image}
                            />
                        )}
                        <div className={styles.itemInfo}>
                            <h3 className={styles.itemName}>{item.productName}</h3>
                            <p className={styles.variantName}>{item.variantName}</p>
                            <p className={styles.quantity}>Quantité: {item.quantity}</p>
                        </div>
                        <div className={styles.itemPrice}>
                            {((item.productPrice * item.quantity) / 100).toFixed(2)} €
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.total}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalPrice}>{(cart.totalPrice / 100).toFixed(2)} €</span>
            </div>

            <div className={styles.itemCount}>
                {cart.totalItems} article{cart.totalItems > 1 ? 's' : ''}
            </div>
        </div>
    );
};

