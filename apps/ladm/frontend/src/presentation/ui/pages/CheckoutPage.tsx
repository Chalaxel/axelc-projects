import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutSummary } from '../components/checkout/CheckoutSummary';
import { DeliverySelector } from '../components/checkout/DeliverySelector';
import { BillingForm } from '../components/checkout/BillingForm';
import { orderService } from '../../../services/orderService';
import { MondialRelayPoint, BillingInfo, CreateOrderRequest } from '@monorepo/shared-types';
import styles from './CheckoutPage.module.css';
import { useCartContext } from '../../context/CartContext';

type CheckoutStep = 'delivery' | 'billing';

export const CheckoutPage = () => {
    const { cart, items, clearCart } = useCartContext();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
    const [selectedRelayPoint, setSelectedRelayPoint] = useState<MondialRelayPoint | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRelayPointSelected = (point: MondialRelayPoint) => {
        setSelectedRelayPoint(point);
        setError(null);
    };

    const handleDeliveryNext = () => {
        if (!selectedRelayPoint) {
            setError('Veuillez sélectionner un point relais pour continuer.');
            return;
        }
        setError(null);
        setCurrentStep('billing');
    };

    const handleBackToDelivery = () => {
        setCurrentStep('delivery');
        setError(null);
    };

    const handleBillingSubmit = async (billingInfo: BillingInfo) => {
        if (!selectedRelayPoint) {
            setError('Erreur: aucun point relais sélectionné.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const orderRequest: CreateOrderRequest = {
                cartItems: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    price: item.productPrice,
                    quantity: item.quantity,
                })),
                shippingInfo: {
                    firstName: billingInfo.firstName,
                    lastName: billingInfo.lastName,
                    email: billingInfo.email,
                    phone: billingInfo.phone,
                    address: selectedRelayPoint.address,
                    city: selectedRelayPoint.city,
                    postalCode: selectedRelayPoint.postalCode,
                    country: selectedRelayPoint.country,
                    deliveryMethod: 'mondial_relay',
                    relayPoint: selectedRelayPoint,
                },
                paymentMethod: 'sumup_online',
                billingInfo,
                relayPoint: selectedRelayPoint,
            };

            const order = await orderService.createOrder(orderRequest);
            clearCart();
            navigate(`/order-confirmation/${order.id}`);
        } catch (err) {
            console.error('Erreur lors de la création de la commande:', err);
            setError(
                'Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Finaliser la commande</h1>

            {/* Stepper */}
            <div className={styles.stepper}>
                <div className={`${styles.step} ${currentStep === 'delivery' ? styles.stepActive : ''} ${currentStep === 'billing' ? styles.stepCompleted : ''}`}>
                    <div className={styles.stepNumber}>
                        {currentStep === 'billing' ? '✓' : '1'}
                    </div>
                    <span className={styles.stepLabel}>Livraison</span>
                </div>
                <div className={styles.stepLine}></div>
                <div className={`${styles.step} ${currentStep === 'billing' ? styles.stepActive : ''}`}>
                    <div className={styles.stepNumber}>2</div>
                    <span className={styles.stepLabel}>Facturation</span>
                </div>
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.content}>
                <div className={styles.formSection}>
                    {currentStep === 'delivery' && (
                        <>
                            <DeliverySelector
                                onRelayPointSelected={handleRelayPointSelected}
                                selectedPoint={selectedRelayPoint}
                            />
                            <button
                                className={styles.nextButton}
                                onClick={handleDeliveryNext}
                                disabled={!selectedRelayPoint}
                            >
                                Continuer vers la facturation →
                            </button>
                        </>
                    )}

                    {currentStep === 'billing' && (
                        <BillingForm
                            onSubmit={handleBillingSubmit}
                            onBack={handleBackToDelivery}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>

                <div className={styles.summarySection}>
                    <CheckoutSummary cart={cart} />
                    
                    {selectedRelayPoint && (
                        <div className={styles.deliveryInfo}>
                            <h3 className={styles.deliveryTitle}>Livraison</h3>
                            <p className={styles.deliveryMethod}>Point Relais Mondial Relay</p>
                            <p className={styles.deliveryPoint}>{selectedRelayPoint.name}</p>
                            <p className={styles.deliveryAddress}>
                                {selectedRelayPoint.address}<br />
                                {selectedRelayPoint.postalCode} {selectedRelayPoint.city}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
