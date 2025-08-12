# Dexcom Nutritionist Dashboard (PoC)

A brandable dashboard to analyze CGM data (Dexcom ONE/ONE+/G6/G7) for nutritionists. This proof‑of‑concept includes:

- Modern UI (Next.js + React) with a dashboard and KPIs
- Brand variables (name + colors) via env
- Admin demo login, Dexcom OAuth flow scaffolding (sandbox or prod), manual sync endpoint
- File-backed JSON storage for tokens & EGVS (replace with Postgres in production)
- Mock data for an instant local preview

> ⚠️ This PoC is **not** a medical device and is not production-hardened. Replace the file-based storage and demo auth before any real use.

---

## 1) Prerequisites
- Node.js 18+ and npm
- Dexcom Developer account + app (for OAuth) — see docs
- (Optional) Tunnel (ngrok/Cloudflare) for local callback URLs

## 2) Configure
Copy env:
```bash
cp .env.example .env
```
Edit `.env` and set:
- `NEXT_PUBLIC_BRAND_NAME`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (dev only)
- `DEXCOM_CLIENT_ID` / `DEXCOM_CLIENT_SECRET`
- `DEXCOM_REDIRECT_URI` (e.g., http://localhost:3000/api/dexcom/callback)
- `DEXCOM_BASE_URL` — start with `https://sandbox-api.dexcom.com`

## 3) Install & Run
```bash
npm install
npm run dev
```
Open `http://localhost:3000/admin`, log in with your dev creds, click **Connect via OAuth**, then **Manual Sync**.

If you haven’t connected Dexcom yet, the dashboard will show **mock data** so you can evaluate the UI immediately.

## 4) How Dexcom Integration Works (high level)
1. **Login:** `/api/dexcom/login` redirects to Dexcom OAuth (v2 endpoints) to request `offline_access`.
2. **Callback:** `/api/dexcom/callback` exchanges the `code` for an `access_token` + `refresh_token` and stores them (file-based for PoC).
3. **Sync:** `/api/dexcom/sync` fetches EGVs for the last 24h and appends them to the local store. The dashboard picks up these points.

> Production: schedule background syncs per client, store in Postgres, add row-level security, audit logs, etc.

## 5) Testing the Analytics
The dashboard computes KPIs (Avg, TIR, GMI, SD, CV) on the server and renders charts with Recharts.
Replace `src/mock/egvs.json` with your sample export from **Dexcom Clarity** (CSV -> transform to JSON) to test with real-looking data.

## 6) Hardening Checklist (next steps)
- Replace demo auth with proper OIDC/MFA and RBAC (Admin/Nutritionist/Client)
- Persist to Postgres; implement tenant isolation
- Add CSV importer (Clarity) and Apple Health / Health Connect adapters (3‑hour delay)
- Implement insights, notes, meal/exercise overlays
- Add PDF reporting and custom domain + full white‑label
- Threat modeling, logs, rate limits, consents, DPIA

## 7) Useful Docs
- Dexcom API v3 overview & v2 OAuth endpoints
- Dexcom OAuth flow: /v2/oauth2/login and /v2/oauth2/token (sandbox: https://sandbox-api.dexcom.com)
- Apple Health / Health Connect share has ~3‑hour delay

