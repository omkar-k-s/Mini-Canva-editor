import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { sendError } from '../utils/response.utils'

/**
 * Runs after express-validator chains — returns 400 with all field errors.
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    sendError(res, 'Validation failed', 400, errors.array())
    return
  }
  next()
}
