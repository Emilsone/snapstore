#!/usr/bin/env node
/**
 * Stillio Personal — Background Scheduler
 * Run alongside your Next.js server:
 *   node scheduler.js
 */

const cron = require('node-cron');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'stillio.db');
const SCREENSHOTS_DIR = path.join(__dirname, 'public', 'screenshots');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const CRON_MAP = {
  hourly:  '0 * * * *',
  daily:   '0 9 * * *',
  weekly:  '0 9 * * 1',
  monthly: '0 9 1 * *',
};

function getDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  return db;
}

function sanitizeUrl(url) {
  return url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_').substring(0, 60);
}

async function findChrome() {
  const paths = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  try {
    const { execSync } = require('child_process');
    return execSync('which google-chrome || which chromium-browser || which chromium 2>/dev/null')
      .toString().trim().split('\n')[0];
  } catch { return null; }
}

async function captureUrl(entry) {
  console.log(`[${new Date().toISOString()}] Capturing ${entry.url}...`);
  try {
    const puppeteer = require('puppeteer-core');
    const executablePath = await findChrome();
    if (!executablePath) { console.error('Chrome not found'); return; }

    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(entry.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    const slug = sanitizeUrl(entry.url);
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${slug}__${ts}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);

    await page.screenshot({ path: filepath, fullPage: true });
    await browser.close();

    const stats = fs.statSync(filepath);
    const db = getDb();
    db.prepare(`INSERT INTO screenshots (url_id, filename, filepath, file_size) VALUES (?, ?, ?, ?)`)
      .run(entry.id, filename, `/screenshots/${filename}`, stats.size);
    db.prepare(`UPDATE urls SET last_captured_at = datetime('now') WHERE id = ?`).run(entry.id);
    db.close();

    console.log(`[${new Date().toISOString()}] ✓ ${filename}`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ✗ ${entry.url}: ${err.message}`);
  }
}

async function runSchedule(schedule) {
  const db = getDb();
  const entries = db.prepare(`SELECT * FROM urls WHERE schedule = ? AND active = 1`).all(schedule);
  db.close();
  for (const entry of entries) await captureUrl(entry);
}

Object.entries(CRON_MAP).forEach(([schedule, cronExpr]) => {
  cron.schedule(cronExpr, () => runSchedule(schedule));
  console.log(`  ✓ ${schedule.padEnd(8)} ${cronExpr}`);
});

console.log('\nStillio scheduler is running. Keep this open alongside: npm start\n');
