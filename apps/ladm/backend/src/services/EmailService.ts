import nodemailer from 'nodemailer';
import { Order } from '@monorepo/shared-types';

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Envoyer une notification email au vendeur pour une nouvelle commande
    static async sendOrderNotificationEmail(order: Order): Promise<void> {
        const sellerEmail = process.env.SELLER_EMAIL;

        if (!sellerEmail || !process.env.SMTP_USER) {
            console.warn('Email configuration incomplete. Skipping email notification.');
            return;
        }

        const itemsList = order.items
            ?.map(
                (item) =>
                    `- ${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€`,
            )
            .join('\n');

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: sellerEmail,
            subject: `Nouvelle commande - ${order.orderNumber}`,
            text: `
Bonjour,

Vous avez reçu une nouvelle commande !

Numéro de commande: ${order.orderNumber}
Montant total: ${(order.totalAmount / 100).toFixed(2)}€
Statut: ${order.status}
Méthode de paiement: ${order.paymentMethod === 'sumup_online' ? 'En ligne (SumUp)' : 'Terminal physique (SumUp)'}

Informations de livraison:
${order.shippingInfo.firstName} ${order.shippingInfo.lastName}
${order.shippingInfo.address}
${order.shippingInfo.postalCode} ${order.shippingInfo.city}
${order.shippingInfo.country}
Téléphone: ${order.shippingInfo.phone}
Email: ${order.shippingInfo.email}

Articles commandés:
${itemsList || 'Aucun article'}

Connectez-vous à votre back-office pour gérer cette commande.

Cordialement,
Votre système de commandes
            `,
            html: `
                <h2>Nouvelle commande - ${order.orderNumber}</h2>
                <p><strong>Montant total:</strong> ${(order.totalAmount / 100).toFixed(2)}€</p>
                <p><strong>Statut:</strong> ${order.status}</p>
                <p><strong>Méthode de paiement:</strong> ${order.paymentMethod === 'sumup_online' ? 'En ligne (SumUp)' : 'Terminal physique (SumUp)'}</p>
                
                <h3>Informations de livraison</h3>
                <p>
                    ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}<br/>
                    ${order.shippingInfo.address}<br/>
                    ${order.shippingInfo.postalCode} ${order.shippingInfo.city}<br/>
                    ${order.shippingInfo.country}<br/>
                    <strong>Téléphone:</strong> ${order.shippingInfo.phone}<br/>
                    <strong>Email:</strong> ${order.shippingInfo.email}
                </p>
                
                <h3>Articles commandés</h3>
                <ul>
                    ${order.items?.map((item) => `<li>${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€</li>`).join('') || '<li>Aucun article</li>'}
                </ul>
                
                <p>Connectez-vous à votre back-office pour gérer cette commande.</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email de notification envoyé pour la commande ${order.orderNumber}`);
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email:", error);
            // Ne pas faire échouer la commande si l'email échoue
        }
    }

    // Envoyer un email au client lors de la création de commande (en attente de validation)
    static async sendOrderPendingValidationEmail(order: Order): Promise<void> {
        const customerEmail = order.shippingInfo.email;

        if (!customerEmail || !process.env.SMTP_USER) {
            console.warn('Email configuration incomplete. Skipping pending validation email.');
            return;
        }

        const itemsList = order.items
            ?.map(
                (item) =>
                    `- ${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€`,
            )
            .join('\n');

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: customerEmail,
            subject: `Demande de commande reçue - ${order.orderNumber}`,
            text: `
Bonjour ${order.shippingInfo.firstName},

Nous avons bien reçu votre demande de commande !

Numéro de commande: ${order.orderNumber}
Montant des articles: ${(order.totalAmount / 100).toFixed(2)}€ (hors frais de livraison)

Articles:
${itemsList || 'Aucun article'}

Adresse de livraison:
${order.shippingInfo.address}
${order.shippingInfo.postalCode} ${order.shippingInfo.city}
${order.shippingInfo.country}

Votre commande est en cours de validation par notre équipe.
Vous recevrez un email avec le montant total (incluant les frais de livraison) et un lien de paiement dans les 48 heures.

Merci de votre confiance !

Cordialement,
L'équipe
            `,
            html: `
                <h2>Demande de commande reçue</h2>
                <p>Bonjour ${order.shippingInfo.firstName},</p>
                <p>Nous avons bien reçu votre demande de commande !</p>
                
                <p><strong>Numéro de commande:</strong> ${order.orderNumber}</p>
                <p><strong>Montant des articles:</strong> ${(order.totalAmount / 100).toFixed(2)}€ (hors frais de livraison)</p>
                
                <h3>Articles</h3>
                <ul>
                    ${order.items?.map((item) => `<li>${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€</li>`).join('') || '<li>Aucun article</li>'}
                </ul>
                
                <h3>Adresse de livraison</h3>
                <p>
                    ${order.shippingInfo.address}<br/>
                    ${order.shippingInfo.postalCode} ${order.shippingInfo.city}<br/>
                    ${order.shippingInfo.country}
                </p>
                
                <p><em>Votre commande est en cours de validation par notre équipe.</em></p>
                <p>Vous recevrez un email avec le montant total (incluant les frais de livraison) et un lien de paiement dans les 48 heures.</p>
                
                <p>Merci de votre confiance !</p>
                <p>Cordialement,<br/>L'équipe</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email pending validation envoyé pour la commande ${order.orderNumber}`);
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email pending validation:", error);
        }
    }

    // Envoyer un email à l'admin pour une nouvelle commande à valider
    static async sendAdminNewOrderEmail(order: Order): Promise<void> {
        const sellerEmail = process.env.SELLER_EMAIL;

        if (!sellerEmail || !process.env.SMTP_USER) {
            console.warn('Email configuration incomplete. Skipping admin notification email.');
            return;
        }

        const itemsList = order.items
            ?.map(
                (item) =>
                    `- ${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€`,
            )
            .join('\n');

        const adminUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: sellerEmail,
            subject: `🔔 Nouvelle commande à valider - ${order.orderNumber}`,
            text: `
Bonjour,

Vous avez reçu une nouvelle commande à valider !

Numéro de commande: ${order.orderNumber}
Montant actuel: ${(order.totalAmount / 100).toFixed(2)}€ (hors frais de livraison)
Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}

Client:
${order.shippingInfo.firstName} ${order.shippingInfo.lastName}
${order.shippingInfo.email}
${order.shippingInfo.phone}

Adresse de livraison:
${order.shippingInfo.address}
${order.shippingInfo.postalCode} ${order.shippingInfo.city}
${order.shippingInfo.country}

Articles commandés:
${itemsList || 'Aucun article'}

ACTION REQUISE:
1. Connectez-vous à votre back-office: ${adminUrl}/admin
2. Calculez les frais de livraison
3. Validez ou refusez la commande

Le client attend votre validation pour recevoir son lien de paiement.

Cordialement,
Votre système de commandes
            `,
            html: `
                <h2>🔔 Nouvelle commande à valider</h2>
                <p><strong>Numéro de commande:</strong> ${order.orderNumber}</p>
                <p><strong>Montant actuel:</strong> ${(order.totalAmount / 100).toFixed(2)}€ (hors frais de livraison)</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                
                <h3>Client</h3>
                <p>
                    ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}<br/>
                    <strong>Email:</strong> ${order.shippingInfo.email}<br/>
                    <strong>Téléphone:</strong> ${order.shippingInfo.phone}
                </p>
                
                <h3>Adresse de livraison</h3>
                <p>
                    ${order.shippingInfo.address}<br/>
                    ${order.shippingInfo.postalCode} ${order.shippingInfo.city}<br/>
                    ${order.shippingInfo.country}
                </p>
                
                <h3>Articles commandés</h3>
                <ul>
                    ${order.items?.map((item) => `<li>${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€</li>`).join('') || '<li>Aucun article</li>'}
                </ul>
                
                <hr/>
                <h3 style="color: #e53e3e;">ACTION REQUISE:</h3>
                <ol>
                    <li>Connectez-vous à votre <a href="${adminUrl}/admin">back-office</a></li>
                    <li>Calculez les frais de livraison</li>
                    <li>Validez ou refusez la commande</li>
                </ol>
                <p><em>Le client attend votre validation pour recevoir son lien de paiement.</em></p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email admin envoyé pour la commande ${order.orderNumber}`);
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email admin:", error);
        }
    }

    // Envoyer un email au client avec le lien de paiement
    static async sendPaymentLinkEmail(order: Order): Promise<void> {
        const customerEmail = order.shippingInfo.email;

        if (!customerEmail || !process.env.SMTP_USER) {
            console.warn('Email configuration incomplete. Skipping payment link email.');
            return;
        }

        const itemsList = order.items
            ?.map(
                (item) =>
                    `- ${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€`,
            )
            .join('\n');

        const paymentUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${order.id}/payment`;
        const expirationDate = order.paymentLinkExpiresAt
            ? new Date(order.paymentLinkExpiresAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
              })
            : '';

        const productTotal = order.totalAmount - (order.shippingCost || 0);
        const shippingCostDisplay = order.shippingCost
            ? (order.shippingCost / 100).toFixed(2)
            : '0.00';

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: customerEmail,
            subject: `✅ Commande validée - Procédez au paiement - ${order.orderNumber}`,
            text: `
Bonjour ${order.shippingInfo.firstName},

Bonne nouvelle ! Votre commande a été validée par notre équipe.

Numéro de commande: ${order.orderNumber}

Détail du montant:
- Articles: ${(productTotal / 100).toFixed(2)}€
- Frais de livraison: ${shippingCostDisplay}€
- TOTAL À PAYER: ${(order.totalAmount / 100).toFixed(2)}€

Articles:
${itemsList || 'Aucun article'}

Pour finaliser votre commande, veuillez procéder au paiement en cliquant sur le lien ci-dessous:

${paymentUrl}

⚠️ IMPORTANT: Ce lien expire le ${expirationDate}
Passé ce délai, votre commande sera automatiquement annulée.

Adresse de livraison:
${order.shippingInfo.address}
${order.shippingInfo.postalCode} ${order.shippingInfo.city}
${order.shippingInfo.country}

Merci de votre confiance !

Cordialement,
L'équipe
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #10b981;">✅ Commande validée</h2>
                    <p>Bonjour ${order.shippingInfo.firstName},</p>
                    <p><strong>Bonne nouvelle ! Votre commande a été validée par notre équipe.</strong></p>
                    
                    <p><strong>Numéro de commande:</strong> ${order.orderNumber}</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Détail du montant</h3>
                        <p style="margin: 5px 0;">Articles: ${(productTotal / 100).toFixed(2)}€</p>
                        <p style="margin: 5px 0;">Frais de livraison: ${shippingCostDisplay}€</p>
                        <hr style="border: none; border-top: 2px solid #d1d5db; margin: 10px 0;">
                        <p style="margin: 5px 0; font-size: 18px; font-weight: bold;">TOTAL À PAYER: ${(order.totalAmount / 100).toFixed(2)}€</p>
                    </div>
                    
                    <h3>Articles</h3>
                    <ul>
                        ${order.items?.map((item) => `<li>${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€</li>`).join('') || '<li>Aucun article</li>'}
                    </ul>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${paymentUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            Procéder au paiement
                        </a>
                    </div>
                    
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #92400e;">
                            <strong>⚠️ IMPORTANT:</strong> Ce lien expire le ${expirationDate}<br/>
                            Passé ce délai, votre commande sera automatiquement annulée.
                        </p>
                    </div>
                    
                    <h3>Adresse de livraison</h3>
                    <p>
                        ${order.shippingInfo.address}<br/>
                        ${order.shippingInfo.postalCode} ${order.shippingInfo.city}<br/>
                        ${order.shippingInfo.country}
                    </p>
                    
                    <p>Merci de votre confiance !</p>
                    <p>Cordialement,<br/>L'équipe</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email lien de paiement envoyé pour la commande ${order.orderNumber}`);
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email lien de paiement:", error);
        }
    }

    // Envoyer un email au client en cas de refus de commande
    static async sendOrderRefusedEmail(order: Order, reason?: string): Promise<void> {
        const customerEmail = order.shippingInfo.email;

        if (!customerEmail || !process.env.SMTP_USER) {
            console.warn('Email configuration incomplete. Skipping refusal email.');
            return;
        }

        const reasonText = reason ? `\n\nRaison: ${reason}` : '';

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: customerEmail,
            subject: `Commande non validée - ${order.orderNumber}`,
            text: `
Bonjour ${order.shippingInfo.firstName},

Nous vous informons que votre demande de commande n'a malheureusement pas pu être validée.

Numéro de commande: ${order.orderNumber}${reasonText}

Si vous avez des questions, n'hésitez pas à nous contacter.

Nous nous excusons pour la gêne occasionnée.

Cordialement,
L'équipe
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ef4444;">Commande non validée</h2>
                    <p>Bonjour ${order.shippingInfo.firstName},</p>
                    <p>Nous vous informons que votre demande de commande n'a malheureusement pas pu être validée.</p>
                    
                    <p><strong>Numéro de commande:</strong> ${order.orderNumber}</p>
                    
                    ${
                        reason
                            ? `
                        <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; color: #991b1b;">
                                <strong>Raison:</strong> ${reason}
                            </p>
                        </div>
                    `
                            : ''
                    }
                    
                    <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                    <p>Nous nous excusons pour la gêne occasionnée.</p>
                    
                    <p>Cordialement,<br/>L'équipe</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email de refus envoyé pour la commande ${order.orderNumber}`);
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email de refus:", error);
        }
    }

    // Envoyer un email au client en cas d'annulation de commande (par admin)
    static async sendOrderCancelledEmail(order: Order, reason?: string): Promise<void> {
        const customerEmail = order.shippingInfo.email;

        if (!customerEmail || !process.env.SMTP_USER) {
            console.warn('Email configuration incomplete. Skipping cancellation email.');
            return;
        }

        const reasonText = reason ? `\n\nMotif de l'annulation: ${reason}` : '';

        const itemsList = order.items
            ?.map(
                (item) =>
                    `- ${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€`,
            )
            .join('\n');

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: customerEmail,
            subject: `Commande annulée - ${order.orderNumber}`,
            text: `
Bonjour ${order.shippingInfo.firstName},

Nous vous informons que votre commande a été annulée.

Numéro de commande: ${order.orderNumber}
Montant: ${(order.totalAmount / 100).toFixed(2)}€${reasonText}

Articles concernés:
${itemsList || 'Aucun article'}

Si vous avez des questions concernant cette annulation, n'hésitez pas à nous contacter.

Nous nous excusons pour la gêne occasionnée et espérons vous revoir bientôt.

Cordialement,
L'équipe
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ef4444;">Commande annulée</h2>
                    <p>Bonjour ${order.shippingInfo.firstName},</p>
                    <p>Nous vous informons que votre commande a été annulée.</p>
                    
                    <p><strong>Numéro de commande:</strong> ${order.orderNumber}</p>
                    <p><strong>Montant:</strong> ${(order.totalAmount / 100).toFixed(2)}€</p>
                    
                    ${
                        reason
                            ? `
                        <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; color: #991b1b;">
                                <strong>Motif de l'annulation:</strong> ${reason}
                            </p>
                        </div>
                    `
                            : ''
                    }
                    
                    <h3>Articles concernés</h3>
                    <ul>
                        ${order.items?.map((item) => `<li>${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€</li>`).join('') || '<li>Aucun article</li>'}
                    </ul>
                    
                    <p>Si vous avez des questions concernant cette annulation, n'hésitez pas à nous contacter.</p>
                    <p>Nous nous excusons pour la gêne occasionnée et espérons vous revoir bientôt.</p>
                    
                    <p>Cordialement,<br/>L'équipe</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email d'annulation envoyé pour la commande ${order.orderNumber}`);
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email d'annulation:", error);
        }
    }

    // Envoyer un email à l'admin pour un paiement reçu
    static async sendAdminPaymentReceivedEmail(order: Order): Promise<void> {
        const sellerEmail = process.env.SELLER_EMAIL;

        if (!sellerEmail || !process.env.SMTP_USER) {
            console.warn('Email configuration incomplete. Skipping admin payment notification.');
            return;
        }

        const itemsList = order.items
            ?.map(
                (item) =>
                    `- ${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€`,
            )
            .join('\n');

        const adminUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const productTotal = order.totalAmount - (order.shippingCost || 0);
        const shippingCostDisplay = order.shippingCost
            ? (order.shippingCost / 100).toFixed(2)
            : '0.00';

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: sellerEmail,
            subject: `💰 Paiement reçu - Commande ${order.orderNumber}`,
            text: `
Bonjour,

Un paiement a été reçu pour la commande ${order.orderNumber} !

Numéro de commande: ${order.orderNumber}
Date: ${new Date().toLocaleDateString('fr-FR')}

Détail du montant:
- Articles: ${(productTotal / 100).toFixed(2)}€
- Frais de livraison: ${shippingCostDisplay}€
- TOTAL PAYÉ: ${(order.totalAmount / 100).toFixed(2)}€

Client:
${order.shippingInfo.firstName} ${order.shippingInfo.lastName}
${order.shippingInfo.email}
${order.shippingInfo.phone}

Adresse de livraison:
${order.shippingInfo.address}
${order.shippingInfo.postalCode} ${order.shippingInfo.city}
${order.shippingInfo.country}

Articles commandés:
${itemsList || 'Aucun article'}

ACTION REQUISE:
Préparez la commande pour expédition.
Accédez au back-office: ${adminUrl}/admin

Cordialement,
Votre système de commandes
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #10b981;">💰 Paiement reçu !</h2>
                    <p>Un paiement a été reçu pour la commande <strong>${order.orderNumber}</strong></p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
                    
                    <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #065f46;">Détail du montant</h3>
                        <p style="margin: 5px 0;">Articles: ${(productTotal / 100).toFixed(2)}€</p>
                        <p style="margin: 5px 0;">Frais de livraison: ${shippingCostDisplay}€</p>
                        <hr style="border: none; border-top: 2px solid #6ee7b7; margin: 10px 0;">
                        <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #065f46;">TOTAL PAYÉ: ${(order.totalAmount / 100).toFixed(2)}€</p>
                    </div>
                    
                    <h3>Client</h3>
                    <p>
                        ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}<br/>
                        <strong>Email:</strong> ${order.shippingInfo.email}<br/>
                        <strong>Téléphone:</strong> ${order.shippingInfo.phone}
                    </p>
                    
                    <h3>Adresse de livraison</h3>
                    <p>
                        ${order.shippingInfo.address}<br/>
                        ${order.shippingInfo.postalCode} ${order.shippingInfo.city}<br/>
                        ${order.shippingInfo.country}
                    </p>
                    
                    <h3>Articles commandés</h3>
                    <ul>
                        ${order.items?.map((item) => `<li>${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€</li>`).join('') || '<li>Aucun article</li>'}
                    </ul>
                    
                    <hr/>
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #92400e;">ACTION REQUISE:</h3>
                        <p style="margin: 0; color: #92400e;">
                            Préparez la commande pour expédition.<br/>
                            <a href="${adminUrl}/admin" style="color: #d97706; font-weight: bold;">Accéder au back-office →</a>
                        </p>
                    </div>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(
                `Email paiement reçu envoyé à l'admin pour la commande ${order.orderNumber}`,
            );
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email paiement reçu à l'admin:", error);
        }
    }

    // Envoyer un email de contact
    static async sendContactEmail(data: {
        name: string;
        email: string;
        message: string;
    }): Promise<void> {
        const sellerEmail = process.env.SELLER_EMAIL;

        if (!sellerEmail || !process.env.SMTP_USER) {
            throw new Error('Configuration email incomplète');
        }

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: sellerEmail,
            subject: `Contact: ${data.name}`,
            text: `
Nouveau message de contact

De: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
Pour répondre, copiez l'adresse: ${data.email}
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d4a574;">📬 Nouveau message de contact</h2>
                    
                    <div style="background-color: #fdf8f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>De:</strong> ${data.name}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                    </div>
                    
                    <h3>Message:</h3>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d4a574; margin: 15px 0;">
                        <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        Pour répondre, cliquez sur l'email ci-dessus ou copiez: ${data.email}
                    </p>
                </div>
            `,
        };

        await this.transporter.sendMail(mailOptions);
    }

    // Envoyer un email de confirmation au client
    static async sendOrderConfirmationEmail(order: Order): Promise<void> {
        const customerEmail = order.shippingInfo.email;

        if (!customerEmail || !process.env.SMTP_USER) {
            console.warn('Email configuration incomplete. Skipping customer confirmation email.');
            return;
        }

        const itemsList = order.items
            ?.map(
                (item) =>
                    `- ${item.product?.name || 'Produit'} (${item.variant?.name || 'Variante'}) x${item.quantity} - ${(item.price / 100).toFixed(2)}€`,
            )
            .join('\n');

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: customerEmail,
            subject: `Confirmation de commande - ${order.orderNumber}`,
            text: `
Bonjour ${order.shippingInfo.firstName},

Merci pour votre commande !

Numéro de commande: ${order.orderNumber}
Montant total: ${(order.totalAmount / 100).toFixed(2)}€

Articles commandés:
${itemsList || 'Aucun article'}

Votre commande sera expédiée à l'adresse suivante:
${order.shippingInfo.address}
${order.shippingInfo.postalCode} ${order.shippingInfo.city}
${order.shippingInfo.country}

Nous vous tiendrons informé de l'avancement de votre commande.

Cordialement,
L'équipe
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(
                `Email de confirmation envoyé au client pour la commande ${order.orderNumber}`,
            );
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
        }
    }
}
