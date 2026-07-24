import { v2 as cloudinary } from 'cloudinary'
import { config } from './env'

if (config.cloudinary.cloudName) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key:    config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure:     true,
  })
  console.log('[Cloudinary] Configured ✓')
} else {
  console.warn('[Cloudinary] Not configured — image uploads will not work.')
}

export { cloudinary }
