import { Request, Response, NextFunction } from 'express'
import JWT from 'jsonwebtoken'
import { config } from '@root/config'
import { NotAuthorizedError } from '@global/helpers/error-handlers'
import { AuthPayload } from '@auth/interfaces/auth.interface'

const log = config.createLogger('authMiddleware')

class AuthMiddleware {
      /**
       * Handles authentication for a logged in user.
       * @param req Express Request object
       * @param res Express Response object
       * @param next Express NextFunction for error handling
       */
    public verifyUser(req: Request, res: Response, next: NextFunction): void {
        // Check if JWT token exists in session
        if (!req.session?.jwt) {
            return next(new NotAuthorizedError('Token not available, please login'))
        }
        
        try {
            // Verify the JWT token
            const payload: AuthPayload = JWT.verify(
                req.session!.jwt, 
                config.JWT_SECRET!
            ) as AuthPayload

            // Attach the payload to the request object
            req.currentUser = payload

            // Proceed to the next middleware
            next()
        } catch (error) {
            log.error('JWT Verification Error:', error)
            
            // Handle different types of JWT errors
            if (error instanceof JWT.TokenExpiredError) {
                return next(new NotAuthorizedError('Token expired, please login again'))
            }
            
            if (error instanceof JWT.JsonWebTokenError) {
                return next(new NotAuthorizedError('Invalid token, please login'))
            }

            // Generic error handling
            next(new NotAuthorizedError('Authentication failed, please login'))
        }
    }

    public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
        if (!req.currentUser) {
            next(new NotAuthorizedError('Authentication is required to access this route'))
        }
        next()
    }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware()