import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit'

export const loginLimiter:  RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 50, 
  message: 'Too many login attempts, please try again later.',
})

export const registerLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, 
  message: 'Too many registration attempts, please try again later.',
})

export const forgotPasswordLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, 
  message: 'Too many password reset attempts. Please try again in 30 minutes.',
})
