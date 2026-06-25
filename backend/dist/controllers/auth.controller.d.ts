import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class AuthController {
    login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    verify(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
export declare const authController: AuthController;
