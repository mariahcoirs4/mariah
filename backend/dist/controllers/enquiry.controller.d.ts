import { Request, Response, NextFunction } from 'express';
export declare class EnquiryController {
    submitEnquiry(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getAllEnquiries(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    deleteEnquiry(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const enquiryController: EnquiryController;
