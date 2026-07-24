import mongoose from 'mongoose'
import { config } from './env'

let isConnected = false

export async function connectDatabase(): Promise<void> {
  if (isConnected) return

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS:          45000,
    })
    isConnected = true
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('[DB] Connection failed:', error)
    // In production (Vercel), don't crash the server — just log and continue.
    // The route handlers will return appropriate errors when DB is unavailable.
    if (config.isProd) {
      console.error('[DB] Running without database — cloud features will be unavailable.')
    } else {
      process.exit(1)
    }
  }
}
