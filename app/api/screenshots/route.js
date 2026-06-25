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

export async function GET(req) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const urlId = searchParams.get('urlId');

  const screenshots = urlId
    ? await sql`SELECT * FROM screenshots WHERE url_id = ${urlId} ORDER BY captured_at DESC`
    : await sql`SELECT * FROM screenshots ORDER BY captured_at DESC LIMIT 50`;

  return NextResponse.json({ screenshots });
}

export async function DELETE(req) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const shots = await sql`SELECT * FROM screenshots WHERE id = ${id}`;
  if (shots.length > 0) {
    await supabase.storage.from('screenshots').remove([shots[0].filename]);
    await sql`DELETE FROM screenshots WHERE id = ${id}`;
  }

  return NextResponse.json({ success: true });
}