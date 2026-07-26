import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import { config } from './config/env'
import { connectDatabase } from './config/database'
import './config/cloudinary' // Initialize Cloudinary

import authRoutes    from './routes/auth.routes'
import projectRoutes from './routes/project.routes'
import uploadRoutes  from './routes/upload.routes'

import { errorHandler } from './middleware/error.middleware'

const app = express()

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}))

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [config.clientUrl, 'https://mini-canva.vercel.app', /\.vercel\.app$/],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})
app.use('/api', limiter)

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' })) // Increased limit for high-res images in canvas JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// ── Logging ───────────────────────────────────────────────────────────────────
if (!config.isProd) {
  app.use(morgan('dev'))
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/upload',   uploadRoutes)

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler)

// ── Start server (not for Vercel — Vercel imports the handler directly) ───────
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  connectDatabase().then(() => {
    app.listen(config.port, () => {
      console.log(`[Server] Running on http://localhost:${config.port}`)
    })
  })
}

export default app
