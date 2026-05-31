import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../data/recruitment.db');

let db: sqlite3.Database;

export function getDb(): sqlite3.Database {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) console.error('DB connection error:', err);
    });
    db.run('PRAGMA journal_mode = WAL');
    db.run('PRAGMA foreign_keys = ON');
  }
  return db;
}

export function initDb(): Promise<void> {
  const database = getDb();
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('seeker','employer','admin')),
      name TEXT NOT NULL,
      phone TEXT,
      avatar TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      description TEXT,
      industry TEXT,
      size TEXT,
      location TEXT,
      website TEXT,
      logo TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL REFERENCES companies(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT,
      salary_min INTEGER,
      salary_max INTEGER,
      location TEXT NOT NULL,
      category TEXT,
      experience TEXT,
      education TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','closed')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      education TEXT,
      experience TEXT,
      skills TEXT,
      self_intro TEXT,
      file_path TEXT,
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL REFERENCES jobs(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      resume_id INTEGER NOT NULL REFERENCES resumes(id),
      cover_letter TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','viewed','interview','rejected','accepted')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
  ];

  return new Promise((resolve, reject) => {
    let remaining = tables.length;
    tables.forEach((sql) => {
      database.run(sql, (err) => {
        if (err) reject(err);
        remaining--;
        if (remaining === 0) {
          // Insert default admin if not exists
          database.run(
            `INSERT OR IGNORE INTO users (email, password, role, name) VALUES ('admin@recruitment.com', '$2a$10$placeholder', 'admin', 'System Admin')`,
            (e) => { if (e) reject(e); else resolve(); }
          );
        }
      });
    });
  });
}
