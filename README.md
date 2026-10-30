# Pepsi × Young Stunners Microsite

Monorepo with a Vite React frontend and a Node/Express backend that talks to TrueFan.

## Structure

```text
frontend/   React UI (home, form, loading, result, how-it-works)
backend/    Express API + SQLite + TrueFan client
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# fill TRUEFAN_API_KEY and confirm VENDOR_ID / TEMPLATE_ID
npm install
npm run dev
```

API: `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: `http://localhost:5173` (proxies `/api` → backend)

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/videos` | Save lead, create `order_id`, call TrueFan |
| GET | `/api/videos/:orderId` | Poll status (refreshes from TrueFan) |
| GET | `/api/videos/:orderId/download` | Stream video as attachment |
| GET | `/api/health` | Health check |

## Database

SQLite file at `backend/data/pepsi.sqlite`:

- `leads` — form fields
- `video_jobs` — `order_id`, `video_id`, status, `video_url`, rejection info
