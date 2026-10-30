import { getDb } from '../client.js'

export function createVideoJob({ leadId, orderId, templateId, vendorId, status = 'queued' }) {
  const db = getDb()
  const result = db
    .prepare(
      `INSERT INTO video_jobs (lead_id, order_id, template_id, vendor_id, status)
       VALUES (@leadId, @orderId, @templateId, @vendorId, @status)`,
    )
    .run({ leadId, orderId, templateId, vendorId, status })

  return result.lastInsertRowid
}

export function getJobByOrderId(orderId) {
  return getDb().prepare('SELECT * FROM video_jobs WHERE order_id = ?').get(orderId)
}

export function updateJobByOrderId(orderId, fields) {
  const allowed = [
    'video_id',
    'status',
    'video_url',
    'rejection_reason',
    'rejection_details',
    'error_message',
  ]

  const entries = Object.entries(fields).filter(([key, value]) => allowed.includes(key) && value !== undefined)
  if (entries.length === 0) return getJobByOrderId(orderId)

  const sets = entries.map(([key]) => `${key} = @${key}`).join(', ')
  const params = Object.fromEntries(entries)
  params.orderId = orderId

  getDb()
    .prepare(
      `UPDATE video_jobs
       SET ${sets}, updated_at = datetime('now')
       WHERE order_id = @orderId`,
    )
    .run(params)

  return getJobByOrderId(orderId)
}
