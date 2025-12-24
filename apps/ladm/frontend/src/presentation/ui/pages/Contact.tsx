import React, { useState } from 'react';
import styles from './Contact.module.css';
import { Container } from '../components/layout/Container';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || "Une erreur est survenue");
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage("Impossible de contacter le serveur. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contact}>
      <Container>
        <h1 className={styles.pageTitle}>Contact</h1>

        <div className={styles.content}>
          <div className={styles.formContainer}>
            <p className={styles.intro}>
              Une question, une demande particulière ? N'hésitez pas à me contacter, 
              je vous répondrai dans les plus brefs délais.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nom</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Votre message..."
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
              </button>

              {submitStatus === 'success' && (
                <div className={styles.successMessage}>
                  ✓ Message envoyé ! Je vous répondrai dans les plus brefs délais.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={styles.errorMessage}>
                  {errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};
