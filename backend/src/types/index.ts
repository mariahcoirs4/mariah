import { Request } from 'express';

export interface AdminPayload {
  id: number;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
}
