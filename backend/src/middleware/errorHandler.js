import { AppError } from '../utils/errors.js'

export function notFoundHandler(_req, res) {
  res.status(404).json({
    status: 'failed',
    message: 'Not found',
  })
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
      code: err.code || undefined,
    })
    return
  }

  console.error(err)
  res.status(500).json({
    status: 'failed',
    message: 'Something went wrong on our side. Please try again later.',
  })
}
