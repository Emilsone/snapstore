import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const urlId = searchParams.get('urlId');
  const db = getDb();
  const screenshots = urlId
    ? db.prepare('SELECT * FROM screenshots WHERE url_id = ? ORDER BY captured_at DESC').all(urlId)
    : db.prepare('SELECT * FROM screenshots ORDER BY captured_at DESC LIMIT 50').all();
  return NextResponse.json({ screenshots });
}

export async function DELETE(req) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const db = getDb();
  const shot = db.prepare('SELECT * FROM screenshots WHERE id = ?').get(id);
  if (shot) {
    const filePath = path.join(process.cwd(), 'public', 'screenshots', shot.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    db.prepare('DELETE FROM screenshots WHERE id = ?').run(id);
  }
  return NextResponse.json({ success: true });
}
