/**
 * Client for pepsi_backend (Django) video APIs.
 * Vite proxies /api → http://127.0.0.1:8000 in development.
 */

export async function createVideo(formValues) {
  const body = {
    firstName: String(formValues.firstName || '').trim(),
    lastName: String(formValues.lastName || '').trim(),
    email: String(formValues.email || '').trim(),
    phone: String(formValues.phone || '').trim().replace(/\s/g, ''),
    packCode: String(formValues.packCode || '').trim(),
    privacyConsent: Boolean(formValues.privacyConsent),
    marketingOptIn: Boolean(formValues.marketingOptIn),
    ageConfirmed: Boolean(formValues.ageConfirmed),
  }

  const response = await fetch('/api/videos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      payload.message || 'We couldn’t start your video. Check your details and try again.',
    )
  }

  return payload
}

export async function getVideoStatus(orderId) {
  const response = await fetch(`/api/videos/${encodeURIComponent(orderId)}`)
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'Could not check video status.')
  }
  return payload.data
}

export function getDownloadUrl(orderId) {
  return `/api/videos/${encodeURIComponent(orderId)}/download`
}
