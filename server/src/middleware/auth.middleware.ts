import { Request, Response, NextFunction } from 'express'
import { jwtUtils } from '../utils/jwt.utils'
import { sendError } from '../utils/response.utils'

export interface AuthRequest extends Request {
  user?: { userId: string; email: string }
}

/**
 * JWT auth middleware — validates Bearer token and attaches user to request.
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Authentication required', 401)
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwtUtils.verify(token)
    req.user = payload
    next()
  } catch (err) {
    console.error('JWT Verification Error:', err)
    sendError(res, 'Invalid or expired token', 401)
  }
}
