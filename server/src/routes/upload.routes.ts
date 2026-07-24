import { Router } from 'express'
import { upload, uploadImage } from '../controllers/upload.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/', authenticate, upload.single('image'), uploadImage)

export default router
