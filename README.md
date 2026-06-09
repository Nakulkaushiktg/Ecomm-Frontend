# Kirti Thread Art — Storefront

Customer-facing store (React + Vite + Tailwind). Talks to the backend API.

## Local development
```bash
npm install
npm run dev          # http://localhost:5173
```
Dev server proxies `/api` and `/uploads` to the backend at
`http://localhost:8002` (see `vite.config.js`). Start the backend first.

## Deploy (Vercel)
1. Push this folder to its own GitHub repo.
2. Import in Vercel (framework: Vite).
3. Edit `vercel.json` — replace `REPLACE-WITH-RENDER-URL.onrender.com` with your
   backend's Render URL (proxies API + uploads to the backend).

The admin panel is a separate app/repo.
