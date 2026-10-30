import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

function required(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

const databasePath = process.env.DATABASE_PATH
  ? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..', process.env.DATABASE_PATH)
  : path.resolve(__dirname, '../../data/pepsi.sqlite')

export const env = {
  port: Number(process.env.PORT || 3001),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databasePath,
  truefan: {
    baseUrl: (process.env.TRUEFAN_BASE_URL || 'https://newvideorequest.truefans.in').replace(/\/$/, ''),
    apiKey: (process.env.TRUEFAN_API_KEY || '').trim(),
    vendorId: Number(process.env.TRUEFAN_VENDOR_ID || 85),
    templateId: (process.env.TRUEFAN_TEMPLATE_ID || '').trim(),
  },
}

console.log(
  `[config] TrueFan key loaded: ${env.truefan.apiKey ? `${env.truefan.apiKey.slice(0, 4)}…(${env.truefan.apiKey.length})` : 'MISSING'}`,
)

export function assertTruefanConfigured() {
  required('TRUEFAN_API_KEY')
  required('TRUEFAN_TEMPLATE_ID')
  if (!Number.isFinite(env.truefan.vendorId)) {
    throw new Error('TRUEFAN_VENDOR_ID must be a number')
  }
}
