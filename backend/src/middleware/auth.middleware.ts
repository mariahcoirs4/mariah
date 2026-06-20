import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest, AdminPayload } from '../types';

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AdminPayload;
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired token.',
    });
  }
}

export default requireAdmin;
