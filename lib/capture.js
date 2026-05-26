import path from 'path';
import fs from 'fs';
import { getDb, getScreenshotsDir } from './db.js';

function sanitizeUrl(url) {
  return url
    .replace(/https?:\/\//, '')
    .replace(/[^a-z0-9]/gi, '_')
    .substring(0, 60);
}

async function findChrome() {
  const chromePaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const p of chromePaths) {
    if (fs.existsSync(p)) return p;
  }

  try {
    const { execSync } = await import('child_process');
    const found = execSync('which google-chrome || which chromium-browser || which chromium 2>/dev/null')
      .toString().trim().split('\n')[0];
    if (found) return found;
  } catch {}

  return null;
}

export async function captureScreenshot(urlId, url) {
  try {
    const puppeteer = await import('puppeteer-core');
    const executablePath = await findChrome();

    if (!executablePath) {
      return {
        success: false,
        error: 'Chrome not found. Install Google Chrome on your machine first.',
      };
    }

    const browser = await puppeteer.default.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    const screenshotsDir = getScreenshotsDir();
    const urlSlug = sanitizeUrl(url);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${urlSlug}__${timestamp}.png`;
    const filepath = path.join(screenshotsDir, filename);

    await page.screenshot({ path: filepath, fullPage: true });
    await browser.close();

    const stats = fs.statSync(filepath);
    const db = getDb();

    db.prepare(`
      INSERT INTO screenshots (url_id, filename, filepath, file_size)
      VALUES (?, ?, ?, ?)
    `).run(urlId, filename, `/screenshots/${filename}`, stats.size);

    db.prepare(`UPDATE urls SET last_captured_at = datetime('now') WHERE id = ?`).run(urlId);

    return { success: true, filepath: `/screenshots/${filename}` };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
