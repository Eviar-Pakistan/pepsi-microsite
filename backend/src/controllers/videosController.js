import { getJobStatus, submitVideoJob } from '../services/videoJobService.js'
import { getJobByOrderId } from '../db/repositories/videoJobsRepo.js'
import { AppError } from '../utils/errors.js'

export async function createVideo(req, res, next) {
  try {
    const result = await submitVideoJob(req.body || {})
    res.status(201).json({
      status: 'success',
      orderId: result.orderId,
      jobStatus: result.status,
    })
  } catch (error) {
    next(error)
  }
}

export async function getVideo(req, res, next) {
  try {
    const { orderId } = req.params
    const job = await getJobStatus(orderId)
    res.json({
      status: 'success',
      data: job,
    })
  } catch (error) {
    next(error)
  }
}

export async function downloadVideo(req, res, next) {
  try {
    const { orderId } = req.params
    const job = getJobByOrderId(orderId)

    if (!job) {
      throw new AppError(404, 'Video job not found.', { code: 'NOT_FOUND' })
    }
    if (job.status !== 'success' || !job.video_url) {
      throw new AppError(409, 'Video is not ready for download yet.', { code: 'NOT_READY' })
    }

    const upstream = await fetch(job.video_url)
    if (!upstream.ok) {
      throw new AppError(502, 'Could not fetch video file. Try opening it in a new tab.', {
        code: 'DOWNLOAD_FAILED',
      })
    }

    const contentType = upstream.headers.get('content-type') || 'video/mp4'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="pepsi-video-${orderId}.mp4"`)

    const buffer = Buffer.from(await upstream.arrayBuffer())
    res.send(buffer)
  } catch (error) {
    next(error)
  }
}
