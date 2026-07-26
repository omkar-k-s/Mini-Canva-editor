import { Request, Response } from 'express'
import crypto from 'crypto'
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

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    // Return success even if user not found to prevent email enumeration
    return sendSuccess(res, null, 200, 'If an account with that email exists, a reset link has been sent.')
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex')
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  await user.save()

  // For development, log the reset URL to console
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
  console.log(`\n\n[DEV] Password Reset Link: ${resetUrl}\n\n`)

  sendSuccess(res, null, 200, 'If an account with that email exists, a reset link has been sent.')
})

/**
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params
  const { password } = req.body

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  })

  if (!user) {
    return sendError(res, 'Token is invalid or has expired', 400)
  }

  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  sendSuccess(res, null, 200, 'Password has been reset successfully')
})
