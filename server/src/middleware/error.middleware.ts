import { Request, Response, NextFunction } from 'express'
import { config } from '../config/env'

/**
 * Global error handler — formats all errors consistently.
 * In production, avoids leaking stack traces.
 */
export const errorHandler = (
  err: Error & { statusCode?: number; status?: number },
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || err.status || 500
  const message    = err.message || 'Internal Server Error'

  console.error(`[Error] ${req.method} ${req.path}:`, err.message)

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.isProd ? {} : { stack: err.stack }),
  })
}
