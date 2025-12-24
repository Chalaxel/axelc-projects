import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Charger les variables d'environnement
dotenv.config();

/**
 * Script de test pour vérifier la configuration SMTP
 * Usage: ts-node src/utils/test-email.ts
 */
export const testEmailConfiguration = async () => {
    console.log('🧪 Test de la configuration email...\n');

    // Vérifier les variables d'environnement
    const requiredVars = {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SELLER_EMAIL: process.env.SELLER_EMAIL,
    };

    console.log("📋 Variables d'environnement détectées:");
    for (const [key, value] of Object.entries(requiredVars)) {
        const status = value ? '✅' : '❌';
        const displayValue = value ? (key === 'SMTP_PASS' ? '***********' : value) : 'NON DÉFINIE';
        console.log(`   ${status} ${key}: ${displayValue}`);
    }

    // Vérifier si toutes les variables sont présentes
    const missingVars = Object.entries(requiredVars)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missingVars.length > 0) {
        console.error("\n❌ Erreur: Variables d'environnement manquantes:");
        missingVars.forEach((varName) => console.error(`   - ${varName}`));
        console.error('\n💡 Conseil: Copiez env.example en .env et remplissez les valeurs');
        console.error('   Voir EMAIL_SETUP_GUIDE.md pour les instructions détaillées');
        process.exit(1);
    }

    console.log('\n🔌 Tentative de connexion au serveur SMTP...');

    // Créer le transporteur
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        // Vérifier la connexion
        await transporter.verify();
        console.log('✅ Connexion au serveur SMTP réussie!\n');

        // Envoyer un email de test
        console.log("📧 Envoi d'un email de test...");
        const testEmail = process.env.SELLER_EMAIL;

        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: testEmail,
            subject: "✅ Test de configuration email - L'Atelier de Mathilde",
            text: `Félicitations !

Votre configuration email fonctionne correctement.

Configuration utilisée:
- Serveur SMTP: ${process.env.SMTP_HOST}
- Port: ${process.env.SMTP_PORT}
- Utilisateur: ${process.env.SMTP_USER}
- Email destinataire: ${testEmail}

Votre système est maintenant prêt à envoyer des emails aux clients et aux administrateurs.

Ce message a été généré automatiquement par le script de test.
`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #10b981;">✅ Configuration email réussie !</h2>
                    <p><strong>Félicitations !</strong></p>
                    <p>Votre configuration email fonctionne correctement.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Configuration utilisée</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li>📡 <strong>Serveur SMTP:</strong> ${process.env.SMTP_HOST}</li>
                            <li>🔌 <strong>Port:</strong> ${process.env.SMTP_PORT}</li>
                            <li>👤 <strong>Utilisateur:</strong> ${process.env.SMTP_USER}</li>
                            <li>📧 <strong>Email destinataire:</strong> ${testEmail}</li>
                        </ul>
                    </div>
                    
                    <p>Votre système est maintenant prêt à envoyer des emails aux clients et aux administrateurs.</p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="font-size: 12px; color: #6b7280;">
                        Ce message a été généré automatiquement par le script de test.<br/>
                        <strong>L'Atelier de Mathilde</strong>
                    </p>
                </div>
            `,
        });

        console.log('✅ Email de test envoyé avec succès!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Destinataire: ${testEmail}`);
        console.log('\n💡 Vérifiez votre boîte de réception (et le dossier spam si nécessaire)');
        console.log(
            "\n🎉 Configuration terminée ! Votre système d'envoi d'emails est opérationnel.",
        );
    } catch (error) {
        console.error("\n❌ Erreur lors du test de l'email:");
        if (error instanceof Error) {
            console.error(`   ${error.message}`);

            // Messages d'aide pour les erreurs courantes
            if (error.message.includes('Invalid login')) {
                console.error("\n💡 Erreur d'authentification:");
                console.error(
                    "   - Si vous utilisez Gmail, assurez-vous d'utiliser un mot de passe d'application",
                );
                console.error('   - Vérifiez que SMTP_USER et SMTP_PASS sont corrects');
                console.error('   - Pour Gmail: https://myaccount.google.com/apppasswords');
            } else if (error.message.includes('ECONNREFUSED')) {
                console.error('\n💡 Connexion refusée:');
                console.error('   - Vérifiez que SMTP_HOST et SMTP_PORT sont corrects');
                console.error('   - Vérifiez votre pare-feu ou antivirus');
            } else if (error.message.includes('ETIMEDOUT')) {
                console.error("\n💡 Délai d'attente dépassé:");
                console.error('   - Vérifiez votre connexion internet');
                console.error('   - Le port 587 pourrait être bloqué par votre réseau');
                console.error('   - Essayez avec SMTP_PORT=465 et SMTP_SECURE=true');
            }
        }

        console.error('\n📖 Consultez le guide: backend/EMAIL_SETUP_GUIDE.md');
        process.exit(1);
    }
};

// Exécuter le test
testEmailConfiguration();
