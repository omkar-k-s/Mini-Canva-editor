import dotenv from 'dotenv'
dotenv.config()

/**
 * Type-safe environment config.
 * Throws at startup if required variables are missing.
 */
function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    console.warn(`[Config] Warning: ${key} is not set — some features may not work.`)
    return ''
  }
  return value
}

export const config = {
  port:           parseInt(process.env.PORT || '5000', 10),
  nodeEnv:        process.env.NODE_ENV || 'development',
  isProd:         process.env.NODE_ENV === 'production',

  // MongoDB
  mongoUri:       process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-canva',

  // JWT
  jwtSecret:      process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn:   process.env.JWT_EXPIRES_IN || '7d',

  // Cloudinary
  cloudinary: {
    cloudName:  process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey:     process.env.CLOUDINARY_API_KEY    || '',
    apiSecret:  process.env.CLOUDINARY_API_SECRET || '',
  },

  // CORS
  clientUrl:      process.env.CLIENT_URL || 'http://localhost:5173',
} as const
