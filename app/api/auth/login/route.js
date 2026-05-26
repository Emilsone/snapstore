import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const validUsername = process.env.STILLIO_USERNAME || 'admin';
    const validPassword = process.env.STILLIO_PASSWORD || 'changeme';

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ username });

    const res = NextResponse.json({ success: true });
    res.cookies.set('stillio_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
