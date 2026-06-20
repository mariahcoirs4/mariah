import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export default requireAdmin;
