import request from 'supertest';
import { initDb } from '../src/models/database';
import app from '../src/app';

beforeAll(async () => {
  await initDb();
}, 10000);

describe('Health Check', () => {
  it('should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth API', () => {
  it('should reject login without credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('should reject registration without required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });

  it('should reject registration with invalid role', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com',
      password: '123456',
      role: 'invalid',
      name: 'Test',
    });
    expect(res.status).toBe(400);
  });

  it('should require auth for /me endpoint', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('should register and login a seeker', async () => {
    const email = `seeker_${Date.now()}@test.com`;
    const reg = await request(app).post('/api/auth/register').send({
      email, password: 'pass123', role: 'seeker', name: 'Seeker',
    });
    expect(reg.status).toBe(201);
    expect(reg.body.token).toBeDefined();

    const login = await request(app).post('/api/auth/login').send({ email, password: 'pass123' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });

  it('should reject wrong password', async () => {
    const email = `wrong_${Date.now()}@test.com`;
    await request(app).post('/api/auth/register').send({
      email, password: 'pass123', role: 'seeker', name: 'Wrong',
    });
    const res = await request(app).post('/api/auth/login').send({ email, password: 'badpass' });
    expect(res.status).toBe(401);
  });

  it('should reject duplicate registration', async () => {
    const email = `dup_${Date.now()}@test.com`;
    await request(app).post('/api/auth/register').send({
      email, password: 'pass123', role: 'seeker', name: 'Dup',
    });
    const res = await request(app).post('/api/auth/register').send({
      email, password: 'pass123', role: 'seeker', name: 'Dup',
    });
    expect(res.status).toBe(409);
  });
});

describe('Jobs API', () => {
  it('should list approved jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 404 for non-existent job', async () => {
    const res = await request(app).get('/api/jobs/99999');
    expect(res.status).toBe(404);
  });

  it('should require auth for creating jobs', async () => {
    const res = await request(app).post('/api/jobs').send({ title: 'Test' });
    expect(res.status).toBe(401);
  });
});

describe('Companies API', () => {
  it('should return 404 for non-existent company', async () => {
    const res = await request(app).get('/api/companies/99999');
    expect(res.status).toBe(404);
  });
});

describe('Admin API', () => {
  it('should reject unauthenticated access', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.status).toBe(401);
  });
});

describe('Applications API', () => {
  it('should require auth for applying', async () => {
    const res = await request(app).post('/api/applications').send({ job_id: 1, resume_id: 1 });
    expect(res.status).toBe(401);
  });

  it('should require auth for my applications', async () => {
    const res = await request(app).get('/api/applications/mine');
    expect(res.status).toBe(401);
  });
});

describe('Resumes API', () => {
  it('should require auth', async () => {
    const res = await request(app).get('/api/resumes');
    expect(res.status).toBe(401);
  });
});

describe('Favorites API', () => {
  it('should require auth', async () => {
    const res = await request(app).get('/api/favorites');
    expect(res.status).toBe(401);
  });
});

describe('Notifications API', () => {
  it('should require auth', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.status).toBe(401);
  });
});
