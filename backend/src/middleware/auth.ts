import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'recruitment-platform-secret-key';

export interface AuthPayload {
  userId: number;
  role: string;
  email: string;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authMiddleware(roles?: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      res.status(401).json({ error: '未登录，请先登录' });
      return;
    }

    try {
      const token = header.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
      (req as any).user = decoded;

      if (roles && !roles.includes(decoded.role)) {
        res.status(403).json({ error: '权限不足' });
        return;
      }
      next();
    } catch {
      res.status(401).json({ error: '登录已过期，请重新登录' });
    }
  };
}
