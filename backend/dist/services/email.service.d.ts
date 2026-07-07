import { CreateEnquiryInput } from '../validators/enquiry.validator';
type EnquiryEmailData = CreateEnquiryInput & {
    id?: number;
};
declare class EmailService {
    sendEnquiryEmails(enquiry: EnquiryEmailData): Promise<void>;
}
export declare const emailService: EmailService;
export {};
