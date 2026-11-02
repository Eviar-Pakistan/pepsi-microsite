# Pepsi × Young Stunners Microsite

Vite React frontend + Django backend that talks to TrueFan.

## Structure

```text
pepsi_frontend/  React UI (home, form, loading, result, how-it-works, T&Cs)
pepsi_backend/   Django API + MySQL + TrueFan client
```

## Setup

### Backend (Django)

```bash
cd pepsi_backend
# fill .env (TRUEFAN_*, DATABASE_*, DJANGO_SECRET_KEY)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

API: `http://127.0.0.1:8000`

### Frontend

```bash
cd pepsi_frontend
npm install
npm run dev
```

UI: `http://localhost:5173` (proxies `/api` → Django on port `8000`)

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/videos` | Create user, call TrueFan, return `orderId` |
| GET | `/api/videos/:orderId` | Poll status (refreshes from TrueFan) |
| GET | `/api/videos/:orderId/download` | Stream video as attachment |
| GET | `/api/health` | Health check |

### Create body

```json
{ "name": "Ali", "email": "ali@example.com", "city": "Karachi" }
```

## Database

MySQL (see `pepsi_backend/.env`):

- `app_user` — name, email, city
- `app_videojob` — `order_id`, status, `video_url`, rejection info
