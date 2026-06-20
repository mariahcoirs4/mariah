export interface EnquiryFilter {
    search?: string;
    startDate?: Date;
    endDate?: Date;
}
export declare class EnquiryRepository {
    create(data: any): Promise<{
        message: string;
        id: number;
        email: string;
        createdAt: Date;
        name: string;
        companyName: string | null;
        phone: string | null;
        country: string | null;
        productInterested: string | null;
        quantity: string | null;
        sourcePage: string | null;
    }>;
    findAll(filter?: EnquiryFilter): Promise<{
        message: string;
        id: number;
        email: string;
        createdAt: Date;
        name: string;
        companyName: string | null;
        phone: string | null;
        country: string | null;
        productInterested: string | null;
        quantity: string | null;
        sourcePage: string | null;
    }[]>;
    delete(id: number): Promise<{
        message: string;
        id: number;
        email: string;
        createdAt: Date;
        name: string;
        companyName: string | null;
        phone: string | null;
        country: string | null;
        productInterested: string | null;
        quantity: string | null;
        sourcePage: string | null;
    }>;
    count(): Promise<number>;
    findRecent(limit?: number): Promise<{
        message: string;
        id: number;
        email: string;
        createdAt: Date;
        name: string;
        companyName: string | null;
        phone: string | null;
        country: string | null;
        productInterested: string | null;
        quantity: string | null;
        sourcePage: string | null;
    }[]>;
}
export declare const enquiryRepository: EnquiryRepository;
