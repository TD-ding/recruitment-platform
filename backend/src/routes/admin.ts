import { Router, Request, Response } from 'express';
import { getDb } from '../models/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All admin routes require admin role
router.use(authMiddleware(['admin']));

// Dashboard stats
router.get('/stats', (_req: Request, res: Response) => {
  const db = getDb();
  const queries = {
    users: 'SELECT COUNT(*) as count FROM users',
    jobs: 'SELECT COUNT(*) as count FROM jobs',
    companies: 'SELECT COUNT(*) as count FROM companies',
    applications: 'SELECT COUNT(*) as count FROM applications',
    pending_jobs: 'SELECT COUNT(*) as count FROM jobs WHERE status = "pending"',
    pending_companies: 'SELECT COUNT(*) as count FROM companies WHERE status = "pending"',
  };

  const results: Record<string, number> = {};
  let remaining = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, sql]) => {
    db.get(sql, (err, row: any) => {
      if (!err) results[key] = row.count;
      remaining--;
      if (remaining === 0) res.json(results);
    });
  });
});

// List users
router.get('/users', (req: Request, res: Response) => {
  const { role, page = '1', limit = '20' } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  const db = getDb();

  let sql = 'SELECT id, email, role, name, phone, created_at FROM users WHERE 1=1';
  const params: any[] = [];
  if (role) { sql += ' AND role = ?'; params.push(role); }
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit as string), offset);

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    res.json(rows);
  });
});

// Delete user
router.delete('/users/:id', (req: Request, res: Response) => {
  const db = getDb();
  db.run('DELETE FROM users WHERE id = ? AND role != "admin"', [req.params.id], function (err) {
    if (err) { res.status(500).json({ error: '删除失败' }); return; }
    if (this.changes === 0) { res.status(404).json({ error: '用户不存在或为管理员' }); return; }
    res.json({ message: '用户已删除' });
  });
});

// List pending jobs
router.get('/jobs/pending', (_req: Request, res: Response) => {
  const db = getDb();
  db.all(
    `SELECT j.*, c.name as company_name FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.status = 'pending' ORDER BY j.created_at`,
    (err, rows) => {
      if (err) { res.status(500).json({ error: '查询失败' }); return; }
      res.json(rows);
    }
  );
});

// Approve/reject job
router.put('/jobs/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: '无效的状态' });
    return;
  }
  const db = getDb();
  db.run('UPDATE jobs SET status = ?, updated_at = datetime("now") WHERE id = ?', [status, req.params.id], function (err) {
    if (err) { res.status(500).json({ error: '更新失败' }); return; }
    if (this.changes === 0) { res.status(404).json({ error: '职位不存在' }); return; }
    res.json({ message: `职位已${status === 'approved' ? '通过' : '拒绝'}审核` });
  });
});

// List pending companies
router.get('/companies/pending', (_req: Request, res: Response) => {
  const db = getDb();
  db.all('SELECT * FROM companies WHERE status = "pending" ORDER BY created_at', (err, rows) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    res.json(rows);
  });
});

// Approve/reject company
router.put('/companies/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: '无效的状态' }); return;
  }
  const db = getDb();
  db.run('UPDATE companies SET status = ?, updated_at = datetime("now") WHERE id = ?', [status, req.params.id], function (err) {
    if (err) { res.status(500).json({ error: '更新失败' }); return; }
    if (this.changes === 0) { res.status(404).json({ error: '公司不存在' }); return; }
    res.json({ message: `公司已${status === 'approved' ? '通过' : '拒绝'}审核` });
  });
});

// Get settings
router.get('/settings', (_req: Request, res: Response) => {
  const db = getDb();
  db.all('SELECT key, value FROM settings', (err, rows: any[]) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    const settings: Record<string, string> = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  });
});

// Update settings
router.put('/settings', (req: Request, res: Response) => {
  const db = getDb();
  const entries = Object.entries(req.body);
  let remaining = entries.length;

  entries.forEach(([key, value]) => {
    db.run(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?',
      [key, value as string, value as string],
      (err) => {
        if (err) console.error('Settings update error:', err);
        remaining--;
        if (remaining === 0) res.json({ message: '设置已更新' });
      }
    );
  });
});

export default router;
