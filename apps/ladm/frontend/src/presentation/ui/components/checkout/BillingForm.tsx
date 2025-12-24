import { useState } from 'react';
import { BillingInfo } from '@monorepo/shared-types';
import styles from './BillingForm.module.css';

interface BillingFormProps {
    onSubmit: (billingInfo: BillingInfo) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export const BillingForm = ({ onSubmit, onBack, isSubmitting }: BillingFormProps) => {
    const [formData, setFormData] = useState<BillingInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof BillingInfo, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof BillingInfo, string>> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Prénom requis';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Nom requis';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Téléphone requis';
        } else if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Numéro de téléphone invalide';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof BillingInfo]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Informations de facturation</h2>
            <p className={styles.subtitle}>
                Ces informations seront utilisées pour votre facture et vous contacter
            </p>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor="firstName" className={styles.label}>
                        Prénom *
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                        placeholder="Votre prénom"
                    />
                    {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="lastName" className={styles.label}>
                        Nom *
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                        placeholder="Votre nom"
                    />
                    {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                    placeholder="votre@email.com"
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>
                    Téléphone *
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                    placeholder="06 12 34 56 78"
                />
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>

            <div className={styles.buttons}>
                <button
                    type="button"
                    onClick={onBack}
                    className={styles.backButton}
                    disabled={isSubmitting}
                >
                    ← Retour
                </button>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
                </button>
            </div>
        </form>
    );
};
