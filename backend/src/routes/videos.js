import { Router } from 'express'
import { createVideo, downloadVideo, getVideo } from '../controllers/videosController.js'

const router = Router()

router.post('/', createVideo)
router.get('/:orderId', getVideo)
router.get('/:orderId/download', downloadVideo)

export default router
