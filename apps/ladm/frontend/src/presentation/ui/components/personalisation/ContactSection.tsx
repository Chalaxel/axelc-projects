import React from 'react';
import { Link } from 'react-router-dom';

import styles from './ContactSection.module.css';

export const ContactSection: React.FC = () => {
  return (
    <section className={styles.contact}>
      <div className={styles.content}>
        <h2>Envie de personnaliser votre article ?</h2>
        <p>
          Chaque projet est unique et mérite une attention particulière.
          Contactez-moi pour discuter de vos idées et créer ensemble quelque
          chose d'unique qui vous ressemble.
        </p>
        <div className={styles.buttons}>
          <Link to="/ladm/contact" className={styles.primaryButton}>
            Me contacter
          </Link>
          <a
            href="mailto:contact@atelierdemathilde.fr"
            className={styles.secondaryButton}
          >
            Envoyer un email
          </a>
        </div>
      </div>
    </section>
  );
};
