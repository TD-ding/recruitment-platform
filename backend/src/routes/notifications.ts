import { Router, Request, Response } from 'express';
import { getDb } from '../models/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get my notifications
router.get('/', authMiddleware(), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.all(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [user.userId],
    (err, rows) => {
      if (err) { res.status(500).json({ error: '查询失败' }); return; }
      res.json(rows);
    }
  );
});

// Mark as read
router.put('/:id/read', authMiddleware(), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.run(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
    [req.params.id, user.userId],
    function (err) {
      if (err) { res.status(500).json({ error: '操作失败' }); return; }
      res.json({ message: '已标记为已读' });
    }
  );
});

// Mark all as read
router.put('/read-all', authMiddleware(), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [user.userId], function (err) {
    if (err) { res.status(500).json({ error: '操作失败' }); return; }
    res.json({ message: '全部已读' });
  });
});

// Get unread count
router.get('/unread-count', authMiddleware(), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.get(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
    [user.userId],
    (err, row: any) => {
      if (err) { res.status(500).json({ error: '查询失败' }); return; }
      res.json({ count: row?.count || 0 });
    }
  );
});

// Create notification (internal helper)
export function createNotification(db: any, userId: number, type: string, title: string, content: string) {
  db.run(
    'INSERT INTO notifications (user_id, type, title, content) VALUES (?, ?, ?, ?)',
    [userId, type, title, content],
    (err: any) => { if (err) console.error('Notification error:', err); }
  );
}

export default router;
