import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error:', err.message);
  res.status(500).json({ error: '服务器内部错误' });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: '接口不存在' });
}
