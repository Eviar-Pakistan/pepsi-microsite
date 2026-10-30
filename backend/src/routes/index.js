import { Router } from 'express'
import videosRouter from './videos.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/videos', videosRouter)

export default router
