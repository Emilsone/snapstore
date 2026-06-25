import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await initDb();
  const urls = await sql`
    SELECT 
      u.*,
      COUNT(s.id) as screenshot_count,
      (
        SELECT filepath FROM screenshots 
        WHERE url_id = u.id 
        ORDER BY captured_at DESC 
        LIMIT 1
      ) as latest_screenshot
    FROM urls u
    LEFT JOIN screenshots s ON s.url_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;
  return NextResponse.json({ urls });
}

export async function POST(req) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, url, schedule } = await req.json();
  if (!name || !url || !schedule) {
    return NextResponse.json({ error: 'name, url and schedule are required' }, { status: 400 });
  }
  await initDb();
  const result = await sql`
    INSERT INTO urls (name, url, schedule) 
    VALUES (${name}, ${url}, ${schedule})
    RETURNING *
  `;
  return NextResponse.json({ url: result[0] });
}