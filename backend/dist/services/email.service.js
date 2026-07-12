"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("../config/env"));
const escapeHtml = (value) => (value || 'Not provided')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
const detailRows = (enquiry) => [
    ['Name', enquiry.name],
    ['Company', enquiry.companyName],
    ['Email', enquiry.email],
    ['WhatsApp / Phone', enquiry.phone],
    ['Country', enquiry.country],
    ['Product', enquiry.productInterested],
    ['Quantity', enquiry.quantity],
    ['Request source', enquiry.sourcePage],
    ['Message', enquiry.message],
]
    .map(([label, value]) => `<tr><td style="padding:7px 12px;font-weight:600;vertical-align:top">${escapeHtml(label)}</td><td style="padding:7px 12px">${escapeHtml(value)}</td></tr>`)
    .join('');
const buildEnquiryEmails = (enquiry, from) => {
    const adminText = [
        'A new quote request has been submitted.',
        `Name: ${enquiry.name}`,
        `Company: ${enquiry.companyName || 'Not provided'}`,
        `Email: ${enquiry.email}`,
        `WhatsApp / Phone: ${enquiry.phone || 'Not provided'}`,
        `Country: ${enquiry.country || 'Not provided'}`,
        `Product: ${enquiry.productInterested || 'Not provided'}`,
        `Quantity: ${enquiry.quantity || 'Not provided'}`,
        `Message: ${enquiry.message}`,
    ].join('\n');
    return [
        {
            from,
            to: env_1.default.ADMIN_EMAIL,
            replyTo: enquiry.email,
            subject: `New quote request from ${enquiry.name}`,
            text: adminText,
            html: `<h2>New quote request</h2><table style="border-collapse:collapse">${detailRows(enquiry)}</table>`,
        },
        {
            from,
            to: enquiry.email,
            replyTo: env_1.default.ADMIN_EMAIL,
            subject: 'We received your quote request — Mariah Coirs Export',
            text: `Hello ${enquiry.name},\n\nThank you for requesting a quote from Mariah Coirs Export. Our export team has received your request and will respond within 24 hours.\n\nProduct: ${enquiry.productInterested || 'Not provided'}\nQuantity: ${enquiry.quantity || 'Not provided'}\n\nRegards,\nMariah Coirs Export`,
            html: `<h2>Thank you, ${escapeHtml(enquiry.name)}</h2><p>We received your quote request. Our export team will respond within 24 hours.</p><table style="border-collapse:collapse">${detailRows(enquiry)}</table><p>Regards,<br>Mariah Coirs Export</p>`,
        },
    ];
};
class EmailService {
    getFromAddress() {
        const from = env_1.default.EMAIL_FROM || env_1.default.SMTP_USER;
        if (!from) {
            throw new Error('Email delivery is not configured. Set EMAIL_FROM or SMTP_USER.');
        }
        return from;
    }
    async sendViaResend(emails) {
        if (!env_1.default.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not configured.');
        }
        await Promise.all(emails.map(async (email) => {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${env_1.default.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: email.from,
                    to: [email.to],
                    reply_to: email.replyTo,
                    subject: email.subject,
                    text: email.text,
                    html: email.html,
                }),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Resend API error (${response.status}): ${errorBody}`);
            }
        }));
    }
    async sendViaSmtp(emails) {
        if (!env_1.default.SMTP_HOST) {
            throw new Error('Email delivery is not configured. Set SMTP or RESEND_API_KEY.');
        }
        const transporter = nodemailer_1.default.createTransport({
            host: env_1.default.SMTP_HOST,
            port: env_1.default.SMTP_PORT,
            secure: env_1.default.SMTP_SECURE,
            auth: env_1.default.SMTP_USER && env_1.default.SMTP_PASSWORD
                ? { user: env_1.default.SMTP_USER, pass: env_1.default.SMTP_PASSWORD }
                : undefined,
        });
        await Promise.all(emails.map((email) => transporter.sendMail({
            from: email.from,
            to: email.to,
            replyTo: email.replyTo,
            subject: email.subject,
            text: email.text,
            html: email.html,
        })));
    }
    async sendEnquiryEmails(enquiry) {
        const from = this.getFromAddress();
        const emails = buildEnquiryEmails(enquiry, from);
        if (env_1.default.RESEND_API_KEY) {
            await this.sendViaResend(emails);
            return;
        }
        await this.sendViaSmtp(emails);
    }
}
exports.emailService = new EmailService();
//# sourceMappingURL=email.service.js.map