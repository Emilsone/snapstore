import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { captureScreenshot } from '@/lib/capture';

const CRON_MAP = {
    hourly: '0 * * * *',
    daily: '0 9 * * *',
    weekly: '0 9 * * 1',
    monthly: '0 9 1 * *',
};

export async function GET(req) {
    // Verify this is called by Railway cron
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDb();
    const urls = await sql`SELECT * FROM urls WHERE active = 1`;

    const now = new Date();
    const results = [];

    for (const entry of urls) {
        const shouldCapture = checkSchedule(entry.schedule, entry.last_captured_at, now);
        if (shouldCapture) {
            const result = await captureScreenshot(entry.id, entry.url);
            results.push({ url: entry.url, ...result });
        }
    }

    return NextResponse.json({ success: true, processed: results.length, results });
}

function checkSchedule(schedule, lastCaptured, now) {
    if (!lastCaptured) return true;
    const last = new Date(lastCaptured);
    const diffMs = now - last;
    const diffHours = diffMs / (1000 * 60 * 60);

    switch (schedule) {
        case 'hourly': return diffHours >= 1;
        case 'daily': return diffHours >= 24;
        case 'weekly': return diffHours >= 168;
        case 'monthly': return diffHours >= 720;
        default: return false;
    }
}