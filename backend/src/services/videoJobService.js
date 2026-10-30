import { env } from '../config/env.js'
import { createLead } from '../db/repositories/leadsRepo.js'
import {
  createVideoJob,
  getJobByOrderId,
  updateJobByOrderId,
} from '../db/repositories/videoJobsRepo.js'
import { AppError, mapRejectionMessage } from '../utils/errors.js'
import { createOrderId } from '../utils/orderId.js'
import { getVideoStatus, postNewRequestWithRetry } from './truefanService.js'

const TERMINAL = new Set(['success', 'rejected', 'failed', 'timeout'])

function normalizeStatusPayload(payload) {
  const data = payload?.data && typeof payload.data === 'object' ? payload.data : payload
  const status = String(data?.status || payload?.status || '').toLowerCase()
  const videoUrl = data?.video_url || payload?.video_url || null
  const videoId = data?.video_id ?? payload?.video_id ?? null
  const rejectionReason = data?.rejection_reason || payload?.rejection_reason || null
  const rejectionDetails = data?.profanity_details || data?.rejection_details || null

  return { status, videoUrl, videoId, rejectionReason, rejectionDetails, raw: payload }
}

export async function submitVideoJob(form) {
  const name = String(form.name || '').trim()
  const email = String(form.email || '').trim()

  if (!name) {
    throw new AppError(400, 'Name is required.', { code: 'VALIDATION' })
  }
  if (!email) {
    throw new AppError(400, 'Email is required.', { code: 'VALIDATION' })
  }
  if (name.length > 1000) {
    throw new AppError(400, 'Name must be 1000 characters or fewer.', { code: 'VALIDATION' })
  }

  const leadId = createLead({
    name,
    email,
    phone: form.phone,
    address: form.address,
    packCode: form.packCode,
    city: form.city,
    purchaseType: form.purchaseType,
  })

  const orderId = createOrderId()
  createVideoJob({
    leadId,
    orderId,
    templateId: env.truefan.templateId,
    vendorId: env.truefan.vendorId,
    status: 'queued',
  })

  try {
    const response = await postNewRequestWithRetry({ orderId, personName: name })
    const videoId =
      response?.video_id ??
      response?.data?.video_id ??
      response?.VideoId ??
      null

    updateJobByOrderId(orderId, {
      video_id: videoId != null ? String(videoId) : null,
      status: 'processing',
    })

    return { orderId, status: 'processing' }
  } catch (error) {
    updateJobByOrderId(orderId, {
      status: 'failed',
      error_message: error.message,
    })
    throw error
  }
}

export async function getJobStatus(orderId) {
  const job = getJobByOrderId(orderId)
  if (!job) {
    throw new AppError(404, 'Video job not found.', { code: 'NOT_FOUND' })
  }

  if (TERMINAL.has(job.status) && job.status !== 'timeout') {
    return toPublicJob(job)
  }

  try {
    const payload = await getVideoStatus({ orderId })
    const normalized = normalizeStatusPayload(payload)

    if (normalized.status === 'success') {
      const updated = updateJobByOrderId(orderId, {
        status: 'success',
        video_id: normalized.videoId != null ? String(normalized.videoId) : job.video_id,
        video_url: normalized.videoUrl,
        rejection_reason: null,
        rejection_details: null,
      })
      return toPublicJob(updated)
    }

    if (normalized.status === 'rejected') {
      const updated = updateJobByOrderId(orderId, {
        status: 'rejected',
        rejection_reason: normalized.rejectionReason,
        rejection_details: normalized.rejectionDetails
          ? JSON.stringify(normalized.rejectionDetails)
          : null,
      })
      return toPublicJob(updated)
    }

    if (normalized.status) {
      const mapped =
        normalized.status === 'validating' || normalized.status === 'processing'
          ? normalized.status
          : 'processing'
      const updated = updateJobByOrderId(orderId, {
        status: mapped,
        video_id: normalized.videoId != null ? String(normalized.videoId) : job.video_id,
      })
      return toPublicJob(updated)
    }

    return toPublicJob(job)
  } catch (error) {
    if (error instanceof AppError && error.code === 'UPSTREAM_AUTH') {
      throw error
    }
    // Keep last known DB status if status poll fails transiently
    return toPublicJob(job)
  }
}

function toPublicJob(job) {
  const publicJob = {
    orderId: job.order_id,
    status: job.status,
    videoUrl: job.video_url || null,
    message: null,
  }

  if (job.status === 'rejected') {
    publicJob.message = mapRejectionMessage(job.rejection_reason)
    publicJob.rejectionReason = job.rejection_reason
  } else if (job.status === 'failed') {
    publicJob.message = 'We couldn’t start your video. Check your details and try again.'
  } else if (job.status === 'timeout') {
    publicJob.message = 'This is taking longer than expected. Please try again later.'
  }

  return publicJob
}
