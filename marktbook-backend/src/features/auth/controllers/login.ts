import { loginSchema } from '@auth/schemes/authValidation'
import HTTP_STATUS from 'http-status-codes'
import { authService } from '@root/shared/services/db/auth.service'
import { Utils } from '@global/helpers/utils'
import { Request, Response, NextFunction } from 'express'
import Logger from 'bunyan'
import { config } from '@root/config'
import { ZodValidationError, BadRequestError } from '@global/helpers/error-handlers'
import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import JWT from 'jsonwebtoken'
import { omit } from 'lodash'
import { userService } from '@service/db/user.service'
import { businessService } from '@service/db/business.service'

const logger: Logger = config.createLogger('signinController')


class Login {
  constructor( ) {
    this.read = this.read.bind(this)
  }
    
  /**
       * Handles singing in an existing user.
       * @param req Express Request object
       * @param res Express Response object
       * @param next Express NextFunction for error handling
       */

  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    // parse data
    const parsedDataOrError = Utils.schemaParser(loginSchema, req.body)
    if (parsedDataOrError !== true) {
      logger.warn('Validation failed:', parsedDataOrError.toString())
      return next(new ZodValidationError(parsedDataOrError.toString()))
    }
    // sanitize input
    const body = Utils.sanitizeInput(req.body)
    const { username, email, password } = body

    const business = await businessService.getBusinessByEmail(email)
    if(!business) {
      logger.warn('business not found')
      return next(new BadRequestError('invalid credentials, business account not found'))
    }

    const existingUser: IAuthDocument | null = await authService.getUserByUsername(username)
    if(!existingUser) {
      logger.warn('user not found')
      return next(new BadRequestError('invalid credentials, user not found'))
    }

    const authUser: IuserDocument| null = await authService.getAuthUser(existingUser, password)
    if(!authUser) {
      logger.warn('incorrect password')
      return next(new BadRequestError('invalid credentials, password not correct'))
    }

    if (business._id.toString() !== authUser.associatedBusinessesId.toString()) {
      return next(new BadRequestError('invalid credentials, user not associated to this business'))
    }

    if (authUser.status !== 'active') {
      return next(new BadRequestError('User account is inactive, contact business administrator'))
    }
    // Update last login 
    await userService.updateUserLogin(authUser._id)

    // Generate JWT token
    const userToken: string = JWT.sign(
      {
        userId: authUser._id,
        username: authUser.username,
        businessId: authUser.associatedBusinessesId,
        email: authUser.email,
      },
          config.JWT_SECRET!
    )
    req.session = { jwt: userToken }

    const nonSensitiveData = omit({ ...authUser.toObject(), id: authUser._id }, 
      ['authId', '__v', 'createdAt', 'updatedAt', 'lastLogin', 'emergencyContact', 'notificationPreferences', 'isVerified', '_id'])

    // Respond to client
    res.status(HTTP_STATUS.OK).json({
      message: 'user login successful',
      data: nonSensitiveData,
      token: userToken,
    })
  }
}

export const login: Login = new Login()