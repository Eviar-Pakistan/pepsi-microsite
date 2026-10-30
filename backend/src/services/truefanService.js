import { env } from '../config/env.js'
import { mapTruefanHttpError } from '../utils/errors.js'

async function truefanFetch(path, { method = 'GET', body } = {}) {
  const url = `${env.truefan.baseUrl}${path}`
  const headers = {
    'x-api-key': env.truefan.apiKey,
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    console.error('[truefan]', method, path, '→', response.status, data)
    throw mapTruefanHttpError(response.status, data)
  }

  return data
}

export async function postNewRequest({ orderId, personName }) {
  return truefanFetch('/api/v2/post_new_request', {
    method: 'POST',
    body: {
      vendor_id: env.truefan.vendorId,
      template_id: env.truefan.templateId,
      order_id: orderId,
      data: {
        person_name: personName,
      },
    },
  })
}

export async function getVideoStatus({ orderId }) {
  return truefanFetch('/api/video-status', {
    method: 'POST',
    body: {
      vendor_id: env.truefan.vendorId,
      order_id: orderId,
    },
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function postNewRequestWithRetry(payload, { retries = 3 } = {}) {
  let attempt = 0
  let delay = 1000

  while (true) {
    try {
      return await postNewRequest(payload)
    } catch (error) {
      const isRetryable = error?.statusCode === 502 && error?.code === 'UPSTREAM_5XX'
      if (!isRetryable || attempt >= retries) throw error
      await sleep(delay)
      delay *= 2
      attempt += 1
    }
  }
}
