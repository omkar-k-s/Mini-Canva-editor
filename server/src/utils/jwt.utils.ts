import jwt from 'jsonwebtoken'
import { config } from '../config/env'

export interface JwtPayload {
  userId: string
  email:  string
}

export const jwtUtils = {
  sign: (payload: JwtPayload): string => {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as string,
    } as jwt.SignOptions)
  },

  verify: (token: string): JwtPayload => {
    return jwt.verify(token, config.jwtSecret) as JwtPayload
  },
}
