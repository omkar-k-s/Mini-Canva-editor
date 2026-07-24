import { Response } from 'express'

export const sendSuccess = (res: Response, data: unknown, statusCode = 200, message = 'Success') => {
  res.status(statusCode).json({ success: true, message, data })
}

export const sendError = (res: Response, message: string, statusCode = 500, errors?: unknown) => {
  res.status(statusCode).json({ success: false, message, ...(errors ? { errors } : {}) })
}
