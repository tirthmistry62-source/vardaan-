# Vardaan+ Deployment Guide

## Architecture

| Part     | Platform        | URL Example                              |
|----------|-----------------|------------------------------------------|
| Frontend | Vercel (free)   | https://vardaan.vercel.app               |
| Backend  | Railway (free)  | https://vardaan-backend.up.railway.app   |
| Database | Supabase (free) | Already configured                       |

---

## Step 1 — Push project to GitHub

1. Go to https://github.com/new and create a new repository (e.g. `vardaan-plus`)
2. Make it **Private** (recommended — contains backend API code)
3. In your terminal, run:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vardaan-plus.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Deploy Backend on Railway

1. Go to https://railway.app and sign up (free with GitHub)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `vardaan-plus` repository
4. When prompted for the root directory, set it to: **`backend`**
5. Railway will auto-detect Python and use `Procfile`

### Add Environment Variables on Railway:
Go to your service → **Variables** tab → add these one by one:

| Variable                  | Value                                      |
|---------------------------|--------------------------------------------|
| `SUPABASE_URL`            | https://stjdpegxkkhmdzgbbtyv.supabase.co   |
| `SUPABASE_SERVICE_ROLE_KEY` | (your service role key from Supabase)    |
| `JWT_SECRET`              | (any long random string, e.g. 32+ chars)   |
| `CORS_ORIGINS`            | https://vardaan.vercel.app                 |

6. After deploy, copy your Railway URL (e.g. `https://vardaan-backend.up.railway.app`)

---

## Step 3 — Deploy Frontend on Vercel

1. Go to https://vercel.com and sign up (free with GitHub)
2. Click **"Add New Project"** → import your `vardaan-plus` repository
3. Set **Root Directory** to: **`frontend`**
4. Vercel auto-detects the build settings from `vercel.json` — no changes needed

### Add Environment Variables on Vercel:
Go to your project → **Settings** → **Environment Variables** → add these:

| Variable                  | Value                                            |
|---------------------------|--------------------------------------------------|
| `REACT_APP_BACKEND_URL`   | https://vardaan-backend.up.railway.app           |

> Firebase variables are optional — only needed if you want push notifications.

5. Click **Deploy** — Vercel will build and deploy automatically

---

## Step 4 — Update CORS on Railway

Once you have your Vercel URL, go back to Railway and update:

| Variable         | Value                          |
|------------------|--------------------------------|
| `CORS_ORIGINS`   | https://your-app.vercel.app    |

Railway will automatically redeploy.

---

## That's it!

Your app will be live at your Vercel URL. Every time you push to GitHub `main`, both Vercel and Railway will auto-redeploy.

---

## Files Created for Deployment

| File                          | Purpose                              |
|-------------------------------|--------------------------------------|
| `frontend/vercel.json`        | Vercel build config + SPA rewrites   |
| `backend/Procfile`            | Start command for Railway/Render     |
| `backend/railway.toml`        | Railway-specific config              |
| `backend/render.yaml`         | Render-specific config (alternative) |
| `backend/requirements-prod.txt` | Slim dependencies for production   |
| `backend/runtime.txt`         | Python version (3.11)                |
