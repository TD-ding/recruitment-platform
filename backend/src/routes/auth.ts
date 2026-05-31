import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../models/database';
import { generateToken, authMiddleware } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, role, name, phone } = req.body;
  if (!email || !password || !role || !name) {
    res.status(400).json({ error: '请填写所有必填字段' });
    return;
  }
  if (!['seeker', 'employer'].includes(role)) {
    res.status(400).json({ error: '无效的用户角色' });
    return;
  }

  const db = getDb();
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (email, password, role, name, phone) VALUES (?, ?, ?, ?, ?)',
      [email, hash, role, name, phone || null],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            res.status(409).json({ error: '该邮箱已被注册' });
          } else {
            res.status(500).json({ error: '注册失败' });
          }
          return;
        }
        const token = generateToken({ userId: this.lastID, role, email });
        res.status(201).json({ token, user: { id: this.lastID, email, role, name } });
      }
    );
  } catch {
    res.status(500).json({ error: '注册失败' });
  }
});

// Login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: '请输入邮箱和密码' });
    return;
  }

  const db = getDb();
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user: any) => {
    if (err) { res.status(500).json({ error: '登录失败' }); return; }
    if (!user) { res.status(401).json({ error: '邮箱或密码错误' }); return; }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) { res.status(401).json({ error: '邮箱或密码错误' }); return; }

    const token = generateToken({ userId: user.id, role: user.role, email: user.email });
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name, avatar: user.avatar },
    });
  });
});

// Get current user
router.get('/me', authMiddleware(), (req: Request, res: Response) => {
  const user = (req as any).user;
  const db = getDb();
  db.get('SELECT id, email, role, name, phone, avatar, created_at FROM users WHERE id = ?', [user.userId], (err, row) => {
    if (err) { res.status(500).json({ error: '查询失败' }); return; }
    res.json(row);
  });
});

export default router;
