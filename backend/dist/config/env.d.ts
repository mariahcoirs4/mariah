export declare const env: {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string;
    DIRECT_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    SMTP_PORT: number;
    SMTP_SECURE: boolean;
    CORS_ORIGIN?: string | undefined;
    SMTP_HOST?: string | undefined;
    SMTP_USER?: string | undefined;
    SMTP_PASSWORD?: string | undefined;
    EMAIL_FROM?: string | undefined;
    RESEND_API_KEY?: string | undefined;
};
export default env;
