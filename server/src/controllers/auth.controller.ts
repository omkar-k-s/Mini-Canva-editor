import { Request, Response } from 'express'
import { User } from '../models/User.model'
import { jwtUtils } from '../utils/jwt.utils'
import { sendSuccess, sendError } from '../utils/response.utils'
import { asyncHandler } from '../utils/asyncHandler'
import type { AuthRequest } from '../middleware/auth.middleware'

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    return sendError(res, 'An account with this email already exists', 409)
  }

  const user = await User.create({ name, email, password })

  const token = jwtUtils.sign({ userId: user.id, email: user.email })

  sendSuccess(res, { user, token }, 201, 'Account created successfully')
})

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return sendError(res, 'Invalid email or password', 401)
  }

  const isValid = await user.comparePassword(password)
  if (!isValid) {
    return sendError(res, 'Invalid email or password', 401)
  }

  const token = jwtUtils.sign({ userId: user.id, email: user.email })

  // Don't include password in response
  const userObj = user.toJSON()

  sendSuccess(res, { user: userObj, token }, 200, 'Login successful')
})

/**
 * GET /api/auth/profile
 */
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.userId)
  if (!user) {
    return sendError(res, 'User not found', 404)
  }
  sendSuccess(res, { user })
})

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // JWT is stateless — logout is handled client-side by removing the token.
  // This endpoint exists for logging/analytics purposes.
  sendSuccess(res, null, 200, 'Logged out successfully')
})
