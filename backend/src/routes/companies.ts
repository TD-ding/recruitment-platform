import { Router, Request, Response } from 'express';
import { getDb } from '../models/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Employer: get my company (must be before /:id)
router.get('/employer/mine', authMiddleware(['employer']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.get('SELECT * FROM companies WHERE user_id = ?', [user.userId], (err, row) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    res.json(row || null);
  });
});

// Employer: create/update company profile
router.post('/', authMiddleware(['employer']), (req: Request, res: Response) => {
  const { name, description, industry, size, location, website } = req.body;
  if (!name || !location) {
    res.status(400).json({ error: '请填写公司名称和所在地' });
    return;
  }
  const db = getDb();
  const user = (req as any).user;

  db.run(
    `INSERT INTO companies (user_id, name, description, industry, size, location, website)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET name=?, description=?, industry=?, size=?, location=?, website=?, status='pending', updated_at=datetime('now')`,
    [user.userId, name, description || null, industry || null, size || null, location, website || null,
     name, description || null, industry || null, size || null, location, website || null],
    function (err) {
      if (err) { res.status(500).json({ error: '保存公司信息失败' }); return; }
      res.json({ message: '公司信息已保存，等待审核' });
    }
  );
});

// Public: get company detail
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  db.get('SELECT * FROM companies WHERE id = ? AND status = "approved"', [req.params.id], (err, row) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    if (!row) { res.status(404).json({ error: '公司不存在' }); return; }
    res.json(row);
  });
});

// Public: get company jobs
router.get('/:id/jobs', (req: Request, res: Response) => {
  const db = getDb();
  db.all('SELECT * FROM jobs WHERE company_id = ? AND status = "approved" ORDER BY created_at DESC', [req.params.id], (err, rows) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    res.json(rows);
  });
});

export default router;
