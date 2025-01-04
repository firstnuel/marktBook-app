import { Request, Response, NextFunction } from 'express'
import JWT from 'jsonwebtoken'
import { config } from '@root/config'
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handlers'
import { AuthPayload } from '@auth/interfaces/auth.interface'
import { userCache } from '@service/redis/user.cache'
import { IuserDocument } from '@users/interfaces/user.interface'
import { userService } from '@service/db/user.service'
import { businessCache } from '@service/redis/business.cache'
import { businessService } from '@service/db/business.service'
import { Utils } from '@global/helpers/utils'

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
      return next(new NotAuthorizedError('Authentication is required to access this route'))
    }
    next()
  }

  public async validateUserRole (req: Request, res: Response, next: NextFunction): Promise<void> {
    const cachedUser = await userCache.getUserfromCache(`${req.currentUser?.userId}`) as IuserDocument
    const user = cachedUser || await userService.getUserById(`${req.currentUser?.userId}`) as IuserDocument
    
    if(user?.status !== 'active' || !( user?.role === 'Owner' || user?.role === 'Manager')) {
      return next(new NotAuthorizedError('Invalid User: Not authorized for user role')) 
    }
  
    next()
  }

  public async validateBusiness (req: Request, res: Response, next: NextFunction): Promise<void> {

    const businessId = req.params.businessId || req.body.businessId
    if (!Utils.isValidObjectId(businessId)) {
      return next(new BadRequestError('Invalid Business ID: businessId is not valid')) 
    }

    const cachedBusiness = await businessCache.getBusinessFromCache(businessId)
    const business = cachedBusiness || await businessService.getBusinessById(businessId)

    if(!business) {
      return next(new NotFoundError('Invalid Business: Business account not found')) 
    }

    if (businessId !== req.currentUser?.businessId) {
      return next(new NotAuthorizedError('Invalid User: Not authorized for Business role'))
    }

    next()
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware()