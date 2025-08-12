import { NextResponse } from 'next/server';
import { authUrl } from '@/server/dexcom';

export async function GET() {
  const url = authUrl('state123');
  return NextResponse.redirect(url);
}
