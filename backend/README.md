# Pepsi backend

Node.js + Express + SQLite + TrueFan.

## Quick start

1. Copy `.env.example` → `.env` and set `TRUEFAN_API_KEY` (and template/vendor if needed).
2. `npm install`
3. `npm run dev`

## Folders

- `src/config` — env
- `src/routes` — HTTP routes
- `src/controllers` — request/response
- `src/services` — TrueFan + job orchestration
- `src/db` — SQLite client, migrate, repositories
- `src/middleware` — errors
- `src/utils` — `order_id`, error mapping
