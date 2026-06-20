import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const token = await authService.login(email, password);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid email or password',
      });
    }
  }

  async verify(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // AuthenticatedRequest means requireAdmin passed, so req.admin is set
    return res.status(200).json({
      success: true,
      admin: req.admin,
    });
  }
}

export const authController = new AuthController();
