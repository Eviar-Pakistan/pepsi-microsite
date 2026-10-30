import { getDb } from '../client.js'

export function createLead({ name, email, phone, address, packCode, city, purchaseType }) {
  const db = getDb()
  const result = db
    .prepare(
      `INSERT INTO leads (name, email, phone, address, pack_code, city, purchase_type)
       VALUES (@name, @email, @phone, @address, @packCode, @city, @purchaseType)`,
    )
    .run({
      name,
      email,
      phone: phone || null,
      address: address || null,
      packCode: packCode || null,
      city: city || null,
      purchaseType: purchaseType || null,
    })

  return result.lastInsertRowid
}

export function getLeadById(id) {
  return getDb().prepare('SELECT * FROM leads WHERE id = ?').get(id)
}
