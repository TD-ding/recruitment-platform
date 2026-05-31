import { Router, Request, Response } from 'express';
import { getDb } from '../models/database';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get my resumes
router.get('/', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.all('SELECT * FROM resumes WHERE user_id = ? ORDER BY is_default DESC, created_at DESC', [user.userId], (err, rows) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    res.json(rows);
  });
});

// Get resume detail
router.get('/:id', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.get('SELECT * FROM resumes WHERE id = ? AND user_id = ?', [req.params.id, user.userId], (err, row) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    if (!row) { res.status(404).json({ error: '简历不存在' }); return; }
    res.json(row);
  });
});

// Create resume
router.post('/', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const { title, name, phone, email, education, experience, skills, self_intro, is_default } = req.body;
  if (!title || !name) {
    res.status(400).json({ error: '请填写简历标题和姓名' });
    return;
  }
  const db = getDb();
  const user = (req as any).user;

  if (is_default) {
    db.run('UPDATE resumes SET is_default = 0 WHERE user_id = ?', [user.userId]);
  }

  db.run(
    `INSERT INTO resumes (user_id, title, name, phone, email, education, experience, skills, self_intro, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user.userId, title, name, phone || null, email || null, education || null, experience || null, skills || null, self_intro || null, is_default ? 1 : 0],
    function (err) {
      if (err) { res.status(500).json({ error: '创建简历失败' }); return; }
      res.status(201).json({ id: this.lastID, message: '简历创建成功' });
    }
  );
});

// Update resume
router.put('/:id', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const { title, name, phone, email, education, experience, skills, self_intro, is_default } = req.body;
  const db = getDb();
  const user = (req as any).user;

  if (is_default) {
    db.run('UPDATE resumes SET is_default = 0 WHERE user_id = ?', [user.userId]);
  }

  db.run(
    `UPDATE resumes SET title=?, name=?, phone=?, email=?, education=?, experience=?, skills=?, self_intro=?, is_default=?, updated_at=datetime('now') WHERE id=? AND user_id=?`,
    [title, name, phone, email, education, experience, skills, self_intro, is_default ? 1 : 0, req.params.id, user.userId],
    function (err) {
      if (err) { res.status(500).json({ error: '更新失败' }); return; }
      if (this.changes === 0) { res.status(404).json({ error: '简历不存在' }); return; }
      res.json({ message: '更新成功' });
    }
  );
});

// Delete resume
router.delete('/:id', authMiddleware(['seeker']), (req: Request, res: Response) => {
  const db = getDb();
  const user = (req as any).user;
  db.run('DELETE FROM resumes WHERE id = ? AND user_id = ?', [req.params.id, user.userId], function (err) {
    if (err) { res.status(500).json({ error: '删除失败' }); return; }
    if (this.changes === 0) { res.status(404).json({ error: '简历不存在' }); return; }
    res.json({ message: '删除成功' });
  });
});

export default router;
