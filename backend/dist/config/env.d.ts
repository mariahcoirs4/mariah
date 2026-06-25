export declare const env: {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    CORS_ORIGIN: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    SMTP_PORT: number;
    SMTP_SECURE: boolean;
    SMTP_HOST?: string | undefined;
    SMTP_USER?: string | undefined;
    SMTP_PASSWORD?: string | undefined;
    EMAIL_FROM?: string | undefined;
};
export default env;
