import { CreateEnquiryInput } from '../validators/enquiry.validator';
export declare class EnquiryService {
    createEnquiry(input: CreateEnquiryInput): Promise<{
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
    getEnquiries(filters?: {
        search?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
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
    deleteEnquiry(id: number): Promise<{
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
}
export declare const enquiryService: EnquiryService;
