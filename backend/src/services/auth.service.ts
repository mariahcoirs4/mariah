import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { adminRepository } from '../repositories/admin.repository';
import { env } from '../config/env';
import { AdminPayload } from '../types';

export class AuthService {
  async login(email: string, password: string): Promise<string> {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const payload: AdminPayload = {
      id: admin.id,
      email: admin.email,
    };

    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, env.JWT_SECRET, options);
  }

  async ensureDefaultAdminExists(): Promise<void> {
    try {
      const existing = await adminRepository.findFirst();
      if (!existing) {
        console.log('⚡ No admin account detected. Creating default admin...');
        const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
        await adminRepository.create({
          email: env.ADMIN_EMAIL,
          password: hashedPassword,
        });
        console.log(`✅ Default admin created successfully: ${env.ADMIN_EMAIL}`);
      }
    } catch (error) {
      console.error('❌ Failed to verify/create default admin account:', error);
    }
  }
}

export const authService = new AuthService();
