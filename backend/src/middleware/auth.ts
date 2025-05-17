import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Middleware to authenticate JWT access tokens
 */
export default function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  if (!token && req.cookies) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, (err, payload) => {
    if (!err && payload) {
      req.userId = (payload as any).userId;
    }
    next();
  });
}
