export async function createVideo(formValues) {
  const response = await fetch('/api/videos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formValues),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'We couldn’t start your video. Check your details and try again.')
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
