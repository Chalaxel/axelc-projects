import { useState } from 'react';
import { ShippingInfo } from '@monorepo/shared-types';
import styles from './ShippingForm.module.css';

interface ShippingFormProps {
    onSubmit: (shippingInfo: ShippingInfo) => void;
    isSubmitting: boolean;
}

export const ShippingForm = ({ onSubmit, isSubmitting }: ShippingFormProps) => {
    const [formData, setFormData] = useState<ShippingInfo>({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France',
        phone: '',
        email: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ShippingInfo, string>> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Prénom requis';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Nom requis';
        }
        if (!formData.address.trim()) {
            newErrors.address = 'Adresse requise';
        }
        if (!formData.city.trim()) {
            newErrors.city = 'Ville requise';
        }
        if (!formData.postalCode.trim()) {
            newErrors.postalCode = 'Code postal requis';
        }
        if (!formData.country.trim()) {
            newErrors.country = 'Pays requis';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Téléphone requis';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalide';
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
        // Effacer l'erreur quand l'utilisateur tape
        if (errors[name as keyof ShippingInfo]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Informations de livraison</h2>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor='firstName' className={styles.label}>
                        Prénom *
                    </label>
                    <input
                        type='text'
                        id='firstName'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                    />
                    {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor='lastName' className={styles.label}>
                        Nom *
                    </label>
                    <input
                        type='text'
                        id='lastName'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                    />
                    {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor='address' className={styles.label}>
                    Adresse *
                </label>
                <input
                    type='text'
                    id='address'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                />
                {errors.address && <span className={styles.error}>{errors.address}</span>}
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor='postalCode' className={styles.label}>
                        Code postal *
                    </label>
                    <input
                        type='text'
                        id='postalCode'
                        name='postalCode'
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.postalCode ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                    />
                    {errors.postalCode && <span className={styles.error}>{errors.postalCode}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor='city' className={styles.label}>
                        Ville *
                    </label>
                    <input
                        type='text'
                        id='city'
                        name='city'
                        value={formData.city}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                    />
                    {errors.city && <span className={styles.error}>{errors.city}</span>}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor='country' className={styles.label}>
                    Pays *
                </label>
                <input
                    type='text'
                    id='country'
                    name='country'
                    value={formData.country}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.country ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                />
                {errors.country && <span className={styles.error}>{errors.country}</span>}
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label htmlFor='phone' className={styles.label}>
                        Téléphone *
                    </label>
                    <input
                        type='tel'
                        id='phone'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                    />
                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor='email' className={styles.label}>
                        Email *
                    </label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                </div>
            </div>

            <button type='submit' className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Traitement...' : 'Procéder au paiement'}
            </button>
        </form>
    );
};
