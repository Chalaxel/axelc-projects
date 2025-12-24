import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

export interface SendEmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
    from?: string;
}

export class BaseEmailService {
    protected transporter: Transporter;
    protected defaultFrom: string;

    constructor(config?: EmailConfig) {
        const emailConfig = config || {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || '',
            },
        };

        this.transporter = nodemailer.createTransport(emailConfig);
        this.defaultFrom = process.env.SMTP_USER || '';
    }

    isConfigured(): boolean {
        return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    }

    async sendEmail(options: SendEmailOptions): Promise<boolean> {
        if (!this.isConfigured()) {
            console.warn('Email configuration incomplete. Skipping email.');
            return false;
        }

        const mailOptions: SendMailOptions = {
            from: options.from || this.defaultFrom,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${options.to}: ${options.subject}`);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    async sendContactEmail(data: {
        name: string;
        email: string;
        message: string;
        recipientEmail: string;
    }): Promise<boolean> {
        return this.sendEmail({
            to: data.recipientEmail,
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
                    <h2>Nouveau message de contact</h2>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>De:</strong> ${data.name}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                    </div>
                    
                    <h3>Message:</h3>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #333; margin: 15px 0;">
                        <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        Pour répondre, cliquez sur l'email ci-dessus ou copiez: ${data.email}
                    </p>
                </div>
            `,
        });
    }
}

export const createEmailService = (config?: EmailConfig): BaseEmailService => {
    return new BaseEmailService(config);
};

