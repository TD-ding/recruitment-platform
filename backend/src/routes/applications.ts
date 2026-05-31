import { Router, Request, Response } from 'express';
import { getDb } from '../models/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Seeker: apply for job
router.post('/', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const { job_id, resume_id, cover_letter } = req.body;
  if (!job_id || !resume_id) {
    res.status(400).json({ error: '请选择职位和简历' });
    return;
  }
  const db = getDb();
  const user = (req as any).user;

  // Check duplicate
  db.get('SELECT id FROM applications WHERE job_id = ? AND user_id = ?', [job_id, user.userId], (err, existing: any) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    if (existing) { res.status(409).json({ error: '已投递过该职位' }); return; }

    db.get('SELECT id FROM resumes WHERE id = ? AND user_id = ?', [resume_id, user.userId], (err2, resume: any) => {
      if (err2 || !resume) { res.status(404).json({ error: '简历不存在' }); return; }

      db.run(
        'INSERT INTO applications (job_id, user_id, resume_id, cover_letter) VALUES (?, ?, ?, ?)',
        [job_id, user.userId, resume_id, cover_letter || null],
        function (err3) {
          if (err3) { res.status(500).json({ error: '投递失败' }); return; }
          res.status(201).json({ id: this.lastID, message: '投递成功' });
        }
      );
    });
  });
});

// Seeker: get my applications
router.get('/mine', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.all(
    `SELECT a.*, j.title as job_title, j.location as job_location, j.salary_min, j.salary_max,
      c.name as company_name, c.logo as company_logo
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE a.user_id = ?
    ORDER BY a.created_at DESC`,
    [user.userId],
    (err, rows) => {
      if (err) { res.status(500).json({ error: '查询失败' }); return; }
      res.json(rows);
    }
  );
});

// Employer: get applications for my jobs
router.get('/employer', authMiddleware(['employer']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.all(
    `SELECT a.*, j.title as job_title, r.name as applicant_name, r.phone as applicant_phone,
      r.email as applicant_email, r.education, r.experience, r.skills, r.self_intro
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    JOIN resumes r ON a.resume_id = r.id
    WHERE c.user_id = ?
    ORDER BY a.created_at DESC`,
    [user.userId],
    (err, rows) => {
      if (err) { res.status(500).json({ error: '查询失败' }); return; }
      res.json(rows);
    }
  );
});

// Employer: update application status
router.put('/:id/status', authMiddleware(['employer']), (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['viewed', 'interview', 'rejected', 'accepted'].includes(status)) {
    res.status(400).json({ error: '无效的状态' });
    return;
  }
  const db = getDb();
  const user = (req as any).user;

  db.get(
    `SELECT a.* FROM applications a JOIN jobs j ON a.job_id = j.id JOIN companies c ON j.company_id = c.id WHERE a.id = ? AND c.user_id = ?`,
    [req.params.id, user.userId],
    (err, app: any) => {
      if (err || !app) { res.status(404).json({ error: '投递记录不存在' }); return; }
      db.run('UPDATE applications SET status = ?, updated_at = datetime("now") WHERE id = ?', [status, req.params.id], (err2) => {
        if (err2) { res.status(500).json({ error: '更新失败' }); return; }
        res.json({ message: '状态已更新' });
      });
    }
  );
});

export default router;
