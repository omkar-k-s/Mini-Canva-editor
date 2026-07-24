import { Request, Response, NextFunction } from 'express'

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

/**
 * Wraps an async route handler so errors are forwarded to Express error middleware.
 * Eliminates try/catch boilerplate in every controller.
 */
export const asyncHandler = (fn: AsyncFn) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
