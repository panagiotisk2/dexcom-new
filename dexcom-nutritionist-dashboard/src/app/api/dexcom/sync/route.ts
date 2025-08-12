import { NextRequest, NextResponse } from 'next/server';
import { getToken, appendEgvs } from '@/server/db';
import { getEgvs, refreshAccessToken } from '@/server/dexcom';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>({}));
  const client = body.client || 'demo-client-1';
  const token = getToken(client);
  if (!token) return NextResponse.json({ error: 'No token for client' }, { status: 400 });

  let access = token.access_token;
  try {
    // default to last 24 hours
    const end = new Date();
    const start = new Date(end.getTime() - 24*60*60*1000);
    const egvs = await getEgvs(access, start.toISOString(), end.toISOString());
    appendEgvs(client, egvs);
    return NextResponse.json({ ok: true, count: egvs.length });
  } catch (e:any) {
    // try refresh
    try {
      const r = await refreshAccessToken(token.refresh_token);
      access = r.access_token;
      const end = new Date();
      const start = new Date(end.getTime() - 24*60*60*1000);
      const egvs = await getEgvs(access, start.toISOString(), end.toISOString());
      appendEgvs(client, egvs);
      return NextResponse.json({ ok: true, count: egvs.length });
    } catch (e2:any) {
      return NextResponse.json({ error: e2.message }, { status: 500 });
    }
  }
}
