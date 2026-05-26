import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function DELETE(_req, { params }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = getDb();
  const shots = db.prepare('SELECT filename FROM screenshots WHERE url_id = ?').all(id);
  for (const shot of shots) {
    const filePath = path.join(process.cwd(), 'public', 'screenshots', shot.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  db.prepare('DELETE FROM urls WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req, { params }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = getDb();
  const existing = db.prepare('SELECT * FROM urls WHERE id = ?').get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.prepare(`UPDATE urls SET name = ?, schedule = ?, active = ? WHERE id = ?`).run(
    body.name ?? existing.name,
    body.schedule ?? existing.schedule,
    body.active !== undefined ? (body.active ? 1 : 0) : existing.active,
    id
  );
  const updated = db.prepare('SELECT * FROM urls WHERE id = ?').get(id);
  return NextResponse.json({ url: updated });
}
