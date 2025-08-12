'use client';

import { useState } from 'react';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ok, setOk] = useState(false);

  const login = async (e:any)=>{
    e.preventDefault();
    const res = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password}) });
    if (res.ok) setOk(true);
    else alert('Invalid credentials');
  };

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <h2>Admin Login (Demo)</h2>
        {!ok ? (
          <form onSubmit={login} className="grid" style={{gap:8, maxWidth:420}}>
            <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="button brand">Login</button>
          </form>
        ) : (
          <div>
            <p className="subtle">Welcome! Configure branding and connect a client below.</p>
            <div className="grid grid-3">
              <div className="card">
                <h3>Branding</h3>
                <div className="subtle">This demo uses env vars: <code>NEXT_PUBLIC_BRAND_NAME</code>, <code>BRAND_PRIMARY_HEX</code>, <code>BRAND_ACCENT_HEX</code>.</div>
              </div>
              <div className="card">
                <h3>Connect Dexcom</h3>
                <p className="subtle">Use the sandbox first. You must set <code>DEXCOM_CLIENT_ID</code>, <code>DEXCOM_CLIENT_SECRET</code>, <code>DEXCOM_REDIRECT_URI</code>.</p>
                <a className="button brand" href="/api/dexcom/login">Connect via OAuth</a>
              </div>
              <div className="card">
                <h3>Sync</h3>
                <form action="/api/dexcom/sync" method="post">
                  <button className="button">Manual Sync (24h)</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
