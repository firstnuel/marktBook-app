import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import { ZodValidationError, BadRequestError, ServerError } from '@root/shared/globals/helpers/error-handlers'
import { registerSchema } from '@auth/schemes/authValidation'
import { IAuthDocument, IRegisterBusinessData } from '@auth/interfaces/auth.interface'
import { authService } from '@root/shared/services/db/auth.service'
import { Utils } from '@root/shared/globals/helpers/utils'
import { singleImageUpload  } from '@root/shared/globals/helpers/cloudinary-upload'
import { IBusinessDocument } from '@business/interfaces/business.interface'
import { businessCache } from '@service/redis/business.cache'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import { userCache } from '@service/redis/user.cache'
import { omit } from 'lodash'
import { authQueue } from '@service/queues/auth.queue'
import { userQueue } from '@service/queues/user.queue'
import { businessQueue } from '@service/queues/business.queue'
import JWT from 'jsonwebtoken'
import { config } from '@root/config'
import Logger from 'bunyan'


const logger: Logger = config.createLogger('registerController')

export class Register {

  constructor( ) {
    this.create = this.create.bind(this)
  }

  /**
   * Handles the registration of a new business and associated user.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Registration attempt initiated.')

      // Validate incoming data
      const parsedDataOrError = Utils.schemaParser(registerSchema, req.body)
      if (parsedDataOrError !== true) {
        logger.warn('Validation failed:', parsedDataOrError.toString())
        return next(new ZodValidationError(parsedDataOrError.toString()))
      }

      // Sanitize input
      const body = Utils.sanitizeInput(req.body)
      const {
        email,
        password,
        businessName,
        username,
        businessLogo,
        adminFullName,
        businessAddress,
        businessType,
        businessCategory,
      } = body

      // Check for existing business
      const checkIfBusinessExist: IAuthDocument | null  = await authService.getBusinessByNameAndEmail(businessName, email)
      if (checkIfBusinessExist) {
        logger.warn(`Business registration failed: Business with name "${businessName}" or email "${email}" already exists.`)
        return next(new BadRequestError('Business with this name or email already exists.'))
      }

      // Generate unique identifiers
      const authObjectId: ObjectId = new ObjectId()
      const ownerId: ObjectId = new ObjectId()
      const businessObjectId: ObjectId = new ObjectId()
      const userUId = Utils.generateRandomIntegers(12).toString()
      const businessUId = Utils.generateRandomIntegers(12).toString()

      // Prepare authentication data
      const authData: IAuthDocument = this.registerBusinessData({
        _id: authObjectId,
        uIds: { userUId, businessUId },
        email,
        adminFullName,
        username,
        password,
        businessName,
        businessAddress,
        businessType,
        businessCategory,
        businessLogo,
      })

      // Perform file upload and data preparation in parallel
      const [ userDataForCache, businessDataForCache] = await Promise.all([
        // uploads(businessLogo, `${businessObjectId}`, true, true),
        this.UserData(authData, ownerId, businessObjectId),
        this.BusinessData(authData, businessObjectId, ownerId),
      ])

      if (businessLogo) {  
        // Update business logo URL
        businessDataForCache.businessLogo = await singleImageUpload(businessLogo, `${businessObjectId}`)
      }

      // Save data to cache
      await Promise.all([
        userCache.saveUserToCache(ownerId.toHexString(), userUId, userDataForCache),
        businessCache.saveBusinessToCache(businessObjectId.toHexString(), businessUId, businessDataForCache),
      ])

      logger.info(`User and business data saved to cache for businessId: ${businessObjectId}`)


      // Sanitize data before queuing for database operations
      const sanitizedUserData = omit(userDataForCache, ['uId'])
      const sanitizedBusinessData = omit(businessDataForCache, ['uId'])

      // Add jobs to queues
      try {
        authQueue.addAuthUserJob('addAuthUserToDb', { value: authData })
        userQueue.addUserJob('addUserToDb', { value: sanitizedUserData })
        businessQueue.addBusinessJob('addBusinessToDb', { value: sanitizedBusinessData })
        logger.info(`Added jobs to queues for businessId: ${businessObjectId}`)
      } catch (queueError) {
        logger.error(`Failed to add jobs to queues: ${(queueError as Error).message}`)
        return next(new ServerError('Failed to process registration. Please try again.'))
      }

      // Generate JWT token
      const userJwt: string = this.signUpToken(authData, ownerId, businessObjectId)
      req.session = { jwt: userJwt }

      logger.info(`Registration successful for businessId: ${businessObjectId}`)

      // Respond to client
      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: 'Business account and user created successfully',
        data: omit(businessDataForCache, ['uId', 'verifyData']), // Exclude sensitive fields
        token: userJwt,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error(`Registration failed: ${error.message}`)
      next(error)
    }
  }

  /**
   * Signs a JWT token with relevant user and business data.
   * @param data Authentication document data
   * @param userId ObjectId of the user
   * @param businessId ObjectId of the business
   * @returns Signed JWT token as a string
   */
  private signUpToken(data: IAuthDocument, userId: ObjectId, businessId: ObjectId): string {
    return JWT.sign(
      {
        userId: userId.toHexString(),
        businessId: businessId.toHexString(),
        email: data.email,
        username: data.username,
        uId: data.uIds
      },
      config.JWT_SECRET!,
      { expiresIn: '1h' } // Set appropriate expiration
    )
  }

  /**
   * Constructs the authentication document for a new business.
   * @param data Registration data adhering to IRegisterBusinessData interface
   * @returns Authentication document conforming to IAuthDocument interface
   */
  private registerBusinessData(data: IRegisterBusinessData): IAuthDocument {
    const {
      businessName,
      email,
      password,
      uIds,
      _id,
      username,
      adminFullName,
      businessAddress,
      businessType,
      businessCategory,
      businessLogo,
    } = data

    return {
      _id,
      uIds,
      email: Utils.lowerCase(email),
      adminFullName: Utils.firstLetterToUpperCase(adminFullName),
      password, // Ensure hashing before storage
      username: Utils.firstLetterToUpperCase(username),
      businessName: Utils.firstLetterToUpperCase(businessName),
      businessAddress,
      businessType,
      businessCategory,
      businessLogo,
      createdAt: new Date(),
    } as IAuthDocument
  }

  /**
   * Constructs the business document for a new business.
   * @param data Authentication document data
   * @param businessObjectId ObjectId of the business
   * @param ownerId ObjectId of the owner user
   * @returns Business document conforming to IBusinessDocument interface
   */
  private BusinessData(data: IAuthDocument, businessObjectId: ObjectId, ownerId: ObjectId): IBusinessDocument {
    const {
      businessName,
      email,
      username,
      uIds,
      businessAddress,
      businessType,
      businessCategory,
    } = data

    return {
      _id: businessObjectId,
      verifiedStatus: false,
      verifyData: {
        owner: '',
        TIN: '',
        CAC: '',
        location: '',
      },
      businessName,
      email,
      admins: [
        {
          userId: ownerId,
          username,
        }
      ],
      businessLogo: '',
      uId: uIds?.businessUId?? '',
      businessCategory,
      businessAddress,
      businessType,
      businessAccount: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        accountType: '',
      },
      businessBio: '',
      notifications: {
        sales: true,
        stockLevel: true,
        dueCreditSales: true,
        userDataChange: true,
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        website: '',
      },
      bgImageVersion: '',
      bgImageId: '',
      createdAt: new Date(),
    } as IBusinessDocument
  }

  /**
   * Constructs the user document for a new user.
   * @param data Authentication document data
   * @param userObjectId ObjectId of the user
   * @param businessObjectId ObjectId of the associated business
   * @returns User document conforming to IuserDocument interface
   */
  private UserData(data: IAuthDocument, userObjectId: ObjectId, businessObjectId: ObjectId): IuserDocument {
    const { username, adminFullName, uIds, email, _id, } = data

    return {
      _id: userObjectId,
      name: adminFullName,
      uId: uIds?.userUId ?? '',
      authId: _id,
      email,
      mobileNumber: null,
      role: 'Owner',
      status: 'active',
      address: '',
      nin: '',
      username,
      associatedBusinessesId: businessObjectId,
      emergencyContact: {
        name: '',
        relationship: '',
        contactNumber: '',
      },
      createdAt: new Date(),
      updatedAt: null,
      lastLogin: null,
      notificationPreferences: {
        emailNotifications: true,
        smsNotifications: true,
      },
      languagePreference: 'english',
      isVerified: false,
      profilePicture: '',
    } as unknown as IuserDocument
  }
}



export const register: Register = new Register()