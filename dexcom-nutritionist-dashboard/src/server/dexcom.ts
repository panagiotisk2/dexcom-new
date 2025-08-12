import { cookies } from 'next/headers';

const base = process.env.DEXCOM_BASE_URL || 'https://sandbox-api.dexcom.com';
const clientId = process.env.DEXCOM_CLIENT_ID!;
const clientSecret = process.env.DEXCOM_CLIENT_SECRET!;
const redirectUri = process.env.DEXCOM_REDIRECT_URI!;

export function authUrl(state: string = 'xyz') {
  const url = new URL('/v2/oauth2/login', base);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'offline_access');
  url.searchParams.set('state', state);
  return url.toString();
}

export async function exchangeCodeForToken(code: string) {
  const url = new URL('/v2/oauth2/token', base);
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${t}`);
  }
  return await res.json();
}

export async function refreshAccessToken(refresh_token: string) {
  const url = new URL('/v2/oauth2/token', base);
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  if (!res.ok) throw new Error('Refresh failed');
  return await res.json();
}

export async function getEgvs(access_token: string, startISO: string, endISO: string) {
  const url = new URL('/v2/users/self/egvs', base);
  url.searchParams.set('startDate', startISO);
  url.searchParams.set('endDate', endISO);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${access_token}` } });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`EGVs fetch failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  return json.egvs || json; // v2/v3 shapes
}
