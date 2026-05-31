import { Router, Request, Response } from 'express';
import { getDb } from '../models/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Add job to favorites
router.post('/', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const { job_id } = req.body;
  if (!job_id) { res.status(400).json({ error: '请选择职位' }); return; }
  const db = getDb();
  const user = (req as any).user;

  db.get('SELECT id FROM favorites WHERE user_id = ? AND job_id = ?', [user.userId, job_id], (err, existing: any) => {
    if (err) { res.status(500).json({ error: '操作失败' }); return; }
    if (existing) { res.status(409).json({ error: '已收藏' }); return; }

    db.run('INSERT INTO favorites (user_id, job_id) VALUES (?, ?)', [user.userId, job_id], function (err2) {
      if (err2) { res.status(500).json({ error: '收藏失败' }); return; }
      res.status(201).json({ id: this.lastID, message: '收藏成功' });
    });
  });
});

// Get my favorites
router.get('/', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.all(
    `SELECT f.id as favorite_id, j.*, c.name as company_name, c.logo as company_logo, c.location as company_location
    FROM favorites f
    JOIN jobs j ON f.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE f.user_id = ? AND j.status = 'approved'
    ORDER BY f.created_at DESC`,
    [user.userId],
    (err, rows) => {
      if (err) { res.status(500).json({ error: '查询失败' }); return; }
      res.json(rows);
    }
  );
});

// Remove from favorites
router.delete('/:job_id', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.run('DELETE FROM favorites WHERE user_id = ? AND job_id = ?', [user.userId, req.params.job_id], function (err) {
    if (err) { res.status(500).json({ error: '取消收藏失败' }); return; }
    res.json({ message: '已取消收藏' });
  });
});

// Check if favorited
router.get('/check/:job_id', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.get('SELECT id FROM favorites WHERE user_id = ? AND job_id = ?', [user.userId, req.params.job_id], (err, row) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    res.json({ favorited: !!row });
  });
});

export default router;
