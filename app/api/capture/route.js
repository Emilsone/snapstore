import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { captureScreenshot } from '@/lib/capture';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { urlId } = await req.json();
  if (!urlId) return NextResponse.json({ error: 'urlId required' }, { status: 400 });
  const db = getDb();
  const entry = db.prepare('SELECT * FROM urls WHERE id = ?').get(urlId);
  if (!entry) return NextResponse.json({ error: 'URL not found' }, { status: 404 });
  const result = await captureScreenshot(entry.id, entry.url);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true, filepath: result.filepath });
}
