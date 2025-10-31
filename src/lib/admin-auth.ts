// Secure Admin Authentication System
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminService } from './database';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = '24h';

export interface AdminSession {
  id: string;
  username: string;
  role: string;
  loginTime: string;
  expiresAt: string;
}

export class AdminAuthService {
  // Generate JWT token
  private static generateToken(payload: any): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Authenticate admin with secure password hashing
  static async authenticate(username: string, password: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
    try {
      // Get admin user from database
      const { data: adminUser, error } = await adminService.getAdminUserByUsername(username);
      
      if (error || !adminUser) {
        return { success: false, error: 'Invalid credentials' };
      }

      if (!adminUser.active) {
        return { success: false, error: 'Account is disabled' };
      }

      // Verify password with bcrypt
      const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
      
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Generate JWT token
      const tokenPayload = {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role,
        loginTime: new Date().toISOString()
      };

      const token = this.generateToken(tokenPayload);

      // Update last login
      await adminService.updateAdminLastLogin(adminUser.id);

      return {
        success: true,
        token,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          role: adminUser.role,
          lastLogin: adminUser.last_login
        }
      };

    } catch (error) {
      console.error('Admin authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Verify admin session
  static async verifySession(token: string): Promise<{ valid: boolean; user?: AdminSession }> {
    try {
      const decoded = this.verifyToken(token);
      
      if (!decoded) {
        return { valid: false };
      }

      // Check if user still exists and is active
      const adminUser = await adminService.getAdminUserById(decoded.id);
      
      if (!adminUser || !adminUser.active) {
        return { valid: false };
      }

      return {
        valid: true,
        user: {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
          loginTime: decoded.loginTime,
          expiresAt: new Date(decoded.exp * 1000).toISOString()
        }
      };

    } catch (error) {
      console.error('Session verification error:', error);
      return { valid: false };
    }
  }

  // Hash password for storage
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Create secure admin user
  static async createSecureAdmin(username: string, email: string, password: string, role: 'admin' | 'manager' | 'staff' = 'admin') {
    try {
      const hashedPassword = await this.hashPassword(password);
      
      const adminData = {
        username,
        email,
        password_hash: hashedPassword,
        role,
        active: true
      };

      return await adminService.createAdminUser(adminData);
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }

  // Change admin password
  static async changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const adminUser = await adminService.getAdminUserById(adminId);
      
      if (!adminUser) {
        return { success: false, error: 'Admin user not found' };
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, adminUser.password_hash);
      
      if (!isCurrentPasswordValid) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      await adminService.updateAdminPassword(adminId, hashedNewPassword);

      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, error: 'Failed to change password' };
    }
  }
}

// Middleware for protecting admin routes
export function requireAdminAuth(handler: any) {
  return async (req: any, res: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || 
                   req.cookies?.adminToken;

      if (!token) {
        return res.status(401).json({ success: false, error: 'No authentication token' });
      }

      const session = await AdminAuthService.verifySession(token);
      
      if (!session.valid) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
      }

      req.admin = session.user;
      return handler(req, res);
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Authentication error' });
    }
  };
}
