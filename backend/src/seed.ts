import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../data/recruitment.db');

async function seed() {
  const db = new sqlite3.Database(DB_PATH);
  const hash = await bcrypt.hash('admin123', 10);

  db.run(
    `INSERT OR IGNORE INTO users (email, password, role, name) VALUES (?, ?, 'admin', 'System Admin')`,
    ['admin@recruitment.com', hash],
    (err) => {
      if (err) { console.error('Seed error:', err); process.exit(1); }
      console.log('Admin user seeded: admin@recruitment.com / admin123');
      db.close();
    }
  );
}

seed();
