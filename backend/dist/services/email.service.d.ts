import { CreateEnquiryInput } from '../validators/enquiry.validator';
type EnquiryEmailData = CreateEnquiryInput & {
    id?: number;
};
declare class EmailService {
    private getFromAddress;
    private sendViaResend;
    private sendViaSmtp;
    sendEnquiryEmails(enquiry: EnquiryEmailData): Promise<void>;
}
export declare const emailService: EmailService;
export {};
