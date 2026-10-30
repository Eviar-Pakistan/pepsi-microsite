import { assertTruefanConfigured, env } from './config/env.js'
import { migrate } from './db/migrate.js'
import { createApp } from './app.js'

migrate()

try {
  assertTruefanConfigured()
} catch (error) {
  console.warn(`[startup] ${error.message}`)
  console.warn('[startup] Set TRUEFAN_API_KEY and TRUEFAN_TEMPLATE_ID in backend/.env before submitting videos.')
}

const app = createApp()

app.listen(env.port, () => {
  console.log(`Pepsi backend listening on http://localhost:${env.port}`)
})
