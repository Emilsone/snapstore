import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'stillio.db');
const SCREENSHOTS_DIR = path.join(process.cwd(), 'public', 'screenshots');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

let _db = null;

export function getDb() {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      schedule TEXT NOT NULL DEFAULT 'daily',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_captured_at TEXT
    );
    CREATE TABLE IF NOT EXISTS screenshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      captured_at TEXT NOT NULL DEFAULT (datetime('now')),
      file_size INTEGER,
      FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE
    );
  `);
  return _db;
}

export function getScreenshotsDir() {
  return SCREENSHOTS_DIR;
}
