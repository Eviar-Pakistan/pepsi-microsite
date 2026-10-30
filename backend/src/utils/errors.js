export class AppError extends Error {
  constructor(statusCode, message, { code, details } = {}) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export function mapTruefanHttpError(status, body) {
  if (status === 401) {
    return new AppError(502, 'Something went wrong on our side. Please try again later.', {
      code: 'UPSTREAM_AUTH',
    })
  }
  if (status === 404) {
    return new AppError(502, 'Something went wrong on our side. Please try again later.', {
      code: 'UPSTREAM_NOT_FOUND',
    })
  }
  if (status === 409) {
    return new AppError(409, 'This request was already submitted.', {
      code: 'DUPLICATE_ORDER_ID',
      details: body,
    })
  }
  if (status >= 500) {
    return new AppError(502, 'Servers are busy. Please try again in a few minutes.', {
      code: 'UPSTREAM_5XX',
    })
  }
  return new AppError(400, 'We couldn’t start your video. Check your details and try again.', {
    code: 'UPSTREAM_4XX',
    details: body,
  })
}

export function mapRejectionMessage(reason) {
  switch (reason) {
    case 'TEXT_PROFANITY':
      return 'That name can’t be used. Try a different one.'
    case 'IMAGE_PROFANITY':
      return 'That image can’t be used. Try another.'
    case 'VALIDATION_FAILED':
      return 'We couldn’t process that. Please try again.'
    default:
      return 'We couldn’t finish your video. Please try again.'
  }
}
