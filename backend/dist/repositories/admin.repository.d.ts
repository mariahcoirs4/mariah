export declare class AdminRepository {
    findByEmail(email: string): Promise<{
        id: number;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findFirst(): Promise<{
        id: number;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: any): Promise<{
        id: number;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const adminRepository: AdminRepository;
