import { Router, Request, Response } from 'express';
import { getDb } from '../models/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public: search jobs
router.get('/', (req: Request, res: Response) => {
  const { keyword, location, category, experience, page = '1', limit = '10' } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  const db = getDb();

  let sql = `SELECT j.*, c.name as company_name, c.logo as company_logo, c.location as company_location
    FROM jobs j JOIN companies c ON j.company_id = c.id
    WHERE j.status = 'approved'`;
  const params: any[] = [];

  if (keyword) {
    sql += ` AND (j.title LIKE ? OR j.description LIKE ? OR j.requirements LIKE ?)`;
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }
  if (location) { sql += ` AND j.location LIKE ?`; params.push(`%${location}%`); }
  if (category) { sql += ` AND j.category = ?`; params.push(category); }
  if (experience) { sql += ` AND j.experience = ?`; params.push(experience); }

  sql += ` ORDER BY j.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit as string), offset);

  db.all(sql, params, (err, rows) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    res.json(rows);
  });
});

// Employer: get my jobs (must be before /:id to avoid route conflict)
router.get('/employer/mine', authMiddleware(['employer']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;

  db.all(
    `SELECT j.*, c.name as company_name FROM jobs j JOIN companies c ON j.company_id = c.id WHERE c.user_id = ? ORDER BY j.created_at DESC`,
    [user.userId],
    (err, rows) => {
      if (err) { res.status(500).json({ error: '查询失败' }); return; }
      res.json(rows);
    }
  );
});

// Public: get job detail
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  db.get(
    `SELECT j.*, c.name as company_name, c.description as company_description, c.logo as company_logo,
      c.location as company_location, c.size as company_size, c.industry as company_industry, c.website as company_website
    FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) { res.status(500).json({ error: '查询失败' }); return; }
      if (!row) { res.status(404).json({ error: '职位不存在' }); return; }
      res.json(row);
    }
  );
});

// Employer: create job
router.post('/', authMiddleware(['employer']), (req: Request, res: Response) => {
  const { title, description, requirements, salary_min, salary_max, location, category, experience, education } = req.body;
  if (!title || !description || !location) {
    res.status(400).json({ error: '请填写职位名称、描述和工作地点' });
    return;
  }
  const db = getDb();
  const user = (req as any).user;

  db.get('SELECT id FROM companies WHERE user_id = ?', [user.userId], (err, company: any) => {
    if (err || !company) { res.status(404).json({ error: '请先创建公司信息' }); return; }

    db.run(
      `INSERT INTO jobs (company_id, title, description, requirements, salary_min, salary_max, location, category, experience, education)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [company.id, title, description, requirements || null, salary_min || null, salary_max || null, location, category || null, experience || null, education || null],
      function (err2) {
        if (err2) { res.status(500).json({ error: '创建职位失败' }); return; }
        res.status(201).json({ id: this.lastID, message: '职位已创建，等待审核' });
      }
    );
  });
});

// Employer: update job
router.put('/:id', authMiddleware(['employer']), (req: Request, res: Response) => {
  const { title, description, requirements, salary_min, salary_max, location, category, experience, education, status } = req.body;
  const db = getDb();
  const user = (req as any).user;

  db.get(
    `SELECT j.* FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.id = ? AND c.user_id = ?`,
    [req.params.id, user.userId],
    (err, job: any) => {
      if (err || !job) { res.status(404).json({ error: '职位不存在或无权修改' }); return; }
      db.run(
        `UPDATE jobs SET title=?, description=?, requirements=?, salary_min=?, salary_max=?, location=?, category=?, experience=?, education=?, status=?, updated_at=datetime('now') WHERE id=?`,
        [title || job.title, description || job.description, requirements || job.requirements, salary_min || job.salary_min, salary_max || job.salary_max, location || job.location, category || job.category, experience || job.experience, education || job.education, status || job.status, req.params.id],
        (err2) => {
          if (err2) { res.status(500).json({ error: '更新失败' }); return; }
          res.json({ message: '更新成功' });
        }
      );
    }
  );
});

// Employer: delete job
router.delete('/:id', authMiddleware(['employer']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;

  db.get(
    `SELECT j.* FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.id = ? AND c.user_id = ?`,
    [req.params.id, user.userId],
    (err, job: any) => {
      if (err || !job) { res.status(404).json({ error: '职位不存在或无权删除' }); return; }
      db.run('DELETE FROM jobs WHERE id = ?', [req.params.id], (err2) => {
        if (err2) { res.status(500).json({ error: '删除失败' }); return; }
        res.json({ message: '删除成功' });
      });
    }
  );
});

export default router;
