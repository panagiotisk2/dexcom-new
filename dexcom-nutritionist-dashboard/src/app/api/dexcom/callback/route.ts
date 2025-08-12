import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/server/dexcom';
import { saveToken } from '@/server/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const client = searchParams.get('client') || 'demo-client-1';
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  try {
    const token = await exchangeCodeForToken(code);
    saveToken(client, token);
    return NextResponse.redirect(new URL(`/?connected=1&client=${client}`, req.url));
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
