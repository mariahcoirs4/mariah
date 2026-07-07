export declare class AuthService {
    login(email: string, password: string): Promise<string>;
    ensureDefaultAdminExists(): Promise<void>;
}
export declare const authService: AuthService;
