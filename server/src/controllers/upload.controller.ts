import { Response } from 'express'
import multer from 'multer'
import { cloudinary } from '../config/cloudinary'
import { sendSuccess, sendError } from '../utils/response.utils'
import { asyncHandler } from '../utils/asyncHandler'
import type { AuthRequest } from '../middleware/auth.middleware'
import { config } from '../config/env'

// ── Multer — store in memory for Cloudinary stream upload ─────────────────────
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

/**
 * POST /api/upload
 * Uploads an image to Cloudinary and returns the URL.
 */
export const uploadImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return sendError(res, 'No file uploaded', 400)
  }

  if (!config.cloudinary.cloudName) {
    return sendError(res, 'Cloudinary not configured — use base64 upload from client', 503)
  }

  // Upload buffer to Cloudinary
  const result = await new Promise<{
    secure_url: string; public_id: string; width: number; height: number
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:          'mini-canva',
        transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result as { secure_url: string; public_id: string; width: number; height: number })
      }
    )
    stream.end(req.file!.buffer)
  })

  sendSuccess(res, {
    url:      result.secure_url,
    publicId: result.public_id,
    width:    result.width,
    height:   result.height,
  })
})
