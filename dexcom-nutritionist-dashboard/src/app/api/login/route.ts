import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.headers.set('Set-Cookie', serialize('session', 'admin', { path: '/', httpOnly: true }));
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
