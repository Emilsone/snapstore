import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function DELETE(_req, { params }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  // Get all screenshots to delete from Supabase Storage
  const shots = await sql`SELECT filename FROM screenshots WHERE url_id = ${id}`;

  if (shots.length > 0) {
    const filenames = shots.map(s => s.filename);
    await supabase.storage.from('screenshots').remove(filenames);
  }

  await sql`DELETE FROM urls WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}

export async function PATCH(req, { params }) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const existing = await sql`SELECT * FROM urls WHERE id = ${id}`;
  if (!existing.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const current = existing[0];
  const updated = await sql`
    UPDATE urls 
    SET 
      name = ${body.name ?? current.name},
      schedule = ${body.schedule ?? current.schedule},
      active = ${body.active !== undefined ? (body.active ? 1 : 0) : current.active}
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json({ url: updated[0] });
}