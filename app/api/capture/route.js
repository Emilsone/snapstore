import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { captureScreenshot } from '@/lib/capture';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { urlId } = await req.json();
  if (!urlId) return NextResponse.json({ error: 'urlId required' }, { status: 400 });

  await initDb();
  const entries = await sql`SELECT * FROM urls WHERE id = ${urlId}`;
  if (!entries.length) return NextResponse.json({ error: 'URL not found' }, { status: 404 });

  const result = await captureScreenshot(entries[0].id, entries[0].url);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ success: true, filepath: result.filepath });
}