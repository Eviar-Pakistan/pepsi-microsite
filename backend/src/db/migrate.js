import { getDb } from './client.js'

export function migrate() {
  const db = getDb()

  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      pack_code TEXT,
      city TEXT,
      purchase_type TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS video_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      order_id TEXT NOT NULL UNIQUE,
      video_id TEXT,
      template_id TEXT,
      vendor_id INTEGER,
      status TEXT NOT NULL DEFAULT 'queued',
      video_url TEXT,
      rejection_reason TEXT,
      rejection_details TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    );

    CREATE INDEX IF NOT EXISTS idx_video_jobs_order_id ON video_jobs(order_id);
    CREATE INDEX IF NOT EXISTS idx_video_jobs_status ON video_jobs(status);
  `)
}

const isDirectRun = process.argv[1] && process.argv[1].includes('migrate.js')
if (isDirectRun) {
  migrate()
  console.log('Migration complete')
}
