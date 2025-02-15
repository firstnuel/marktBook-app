/* eslint-disable @typescript-eslint/no-explicit-any */
import { businessCache } from '@service/redis/business.cache'
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import { ZodValidationError, ServerError, BadRequestError } from '@root/shared/globals/helpers/error-handlers'
import { IuserDocument, IuserData } from '../interfaces/user.interface'
import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { userSchema } from '../schemes/userValidation'
import { Utils } from '@global/helpers/utils'
import { userService } from '@service/db/user.service'
import { userCache } from '@service/redis/user.cache'
import { IBusinessAdmin, IBusinessDocument } from '@business/interfaces/business.interface'
import { businessService } from '@service/db/business.service'
import { config } from '@root/config'
import { userQueue } from '@service/queues/user.queue'
import { authQueue } from '@service/queues/auth.queue'
import { businessQueue } from '@service/queues/business.queue'
import { Schema } from 'zod'
import { authService } from '@service/db/auth.service'
import { ActionType, createActivityLog, EntityType } from '@activity/interfaces/logs.interfaces'
import { logService } from '@service/db/logs.service'


const log  = config.createLogger('userController')


export class Users {
  constructor(){
    this.userData = this.userData.bind(this)
    this.checkUser = this.checkUser.bind(this)
    this.create = this.create.bind(this)
    this.read = this.read.bind(this)

  }

  /**
     * Handles creating of new user and adding to auth
     * @param req Express Request object
     * @param res Express Response object
     * @param next Express NextFunction for error handling
     */

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      log.info('User creation attempt implemented')

      // validate input
      this.validateInput(userSchema, req.body)

      // validate user
      const existingUser = await this.checkUser(`${req.currentUser?.userId}`)

      // sanitize input
      const body = Utils.sanitizeInput(req.body) as IuserData
      const { username, mobileNumber, name, role, status, address, nin, businessId } = body 

      // Check if user account already exist
      const checkExistingAuthAccount: IAuthDocument | null =  await authService.getUserByUsername(username)
      if (checkExistingAuthAccount) {
        log.warn(`User registration failed: Account with username "${username}" already exists.`)
        return next(new BadRequestError('User account with this username already exists.'))
      }

      // validate business
      const existingBusiness = await this.checkBusiness(`${businessId}`)

      // Generate unique identifiers
      const newUserId: ObjectId = new ObjectId()
      const authObjectId: ObjectId = new ObjectId()
      const password = Utils.generateRandomIntegers(9).toString()

      // Prepare authentication data
      const authData = {
        _id: authObjectId,
        email: existingBusiness.email,
        adminFullName: Utils.firstLetterToUpperCase(name),
        username,
        password,
        businessName: existingBusiness.businessName!,
        businessAddress: existingBusiness.businessAddress!,
        businessType: existingBusiness.businessType!,
        businessCategory: existingBusiness.businessCategory!,
        businessLogo: existingBusiness.businessLogo || '',
      } as IAuthDocument

      const userData: IuserDocument = this.userData(authData, nin, newUserId, new ObjectId(businessId), status, address, role, mobileNumber)
      const adminData = {
        userId: newUserId,
        username,
      } as IBusinessAdmin
      
      // Add jobs to queues
      try {
        authQueue.addAuthUserJob('addAuthUserToDb', { value: authData })
        userQueue.addUserJob('addUserToDb', { value: userData })
        businessQueue.updateBusisnessJob('updateBusinessAdin', { value: { admin: adminData, id: existingBusiness._id } } )
        log.info(`Added jobs to queues for userId: ${newUserId}`)
      } catch (queueError) {
        log.error(`Failed to add jobs to queues: ${(queueError as Error).message}`)
        return next(new ServerError('Failed to process registration. Please try again.'))
      }

      // log user activity
      const logData = createActivityLog (
        existingUser._id, 
        existingUser.username, 
        existingUser.associatedBusinessesId, 
        'CREATE' as ActionType, 
        'USER' as EntityType,
        `${authObjectId}`,
        `Created user '${username}'`)
      
      await logService.createLog(logData)
      

      log.info(`User '${name} account created successfully`)
      // Respond to client
      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: `User '${userData.name} account created successfully`,
        data: userData
      })
    } catch (error: any) {
      log.error(`User registration failed: ${error.message}`)
      next(error)
    }
  
  }

  /**
     * Protected method to validate input
     * @param userId string
     * @returns IuserDocument
     */

  protected validateInput(schema: Schema, data: any): boolean  {
    const parsedDataOrError = Utils.schemaParser(schema, data)
    if (parsedDataOrError !== true) {
      log.warn('Validation failed:', parsedDataOrError.toString())
      throw new ZodValidationError(parsedDataOrError.toString())
    }
    return parsedDataOrError
  }

  /**
     * Protected method to validate user role and status
     * @param userId string
     * @returns IuserDocument
     */

  protected async checkUser(userId: string): Promise<IuserDocument> {
    const cachedUser = await userCache.getUserfromCache(userId) as IuserDocument
    const existingUser = cachedUser? cachedUser  : await userService.getUserById(userId) as IuserDocument

    return existingUser
  }

  /**
     * Protected method to validate business and user authorization for it.
     * @param businessId string
     * @param user IuserDocument
     * @returns IBusinessDocument
     */
  protected async checkBusiness(businessId: string): Promise<IBusinessDocument> {
    const cachedBusiness = await businessCache.getBusinessFromCache(businessId) as IBusinessDocument
    const existingBusiness = cachedBusiness ? cachedBusiness : await businessService.getBusinessById(businessId) as IBusinessDocument


    return existingBusiness
  }

  /**
     * Constructs the user document for a new user.
     * @param data Authentication data containing initial user information
     * @param nin National Identification Number (optional) for user verification
     * @param userObjectId Unique MongoDB ObjectId generated for the new user
     * @param businessObjectId Unique MongoDB ObjectId of the associated business
     * @param status Current status of the user account (e.g., 'active', 'pending')
     * @param address User's physical address (optional)
     * @param role User's role in the system (e.g., 'admin', 'seller', 'customer')
     * @param mobileNumber User's mobile phone number (optional)
     * @returns User document conforming to IuserDocument interface
     */

  private userData(
    data: IAuthDocument, 
    nin: string = '',
    userObjectId: ObjectId, 
    businessObjectId: ObjectId, 
    status: string, 
    address: string = '',
    role: string, 
    mobileNumber: string='' 
  ): IuserDocument {
    const { username, adminFullName, email, _id, } = data
    
    return {
      _id: userObjectId,
      name: adminFullName,
      authId: _id,
      email,
      mobileNumber,
      role,
      status,
      address,
      nin,
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

  /**
     * Handles returning all users 
     * @param req Express Request object
     * @param res Express Response object
     * @param next Express NextFunction for error handling
     */
  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {

    try{
      // validate user
      const existingUser = await this.checkUser(`${req.currentUser?.userId}`)
  
      let users = await userService.getAllUsers(existingUser.associatedBusinessesId)
      users = users?.filter(user => user._id.toString() !== existingUser._id.toString())

      const message = users.length? 'Users data fetched successfully' : 'No user found'
      res.status(HTTP_STATUS.OK).json({ message, data: users })

    } catch (error: any) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching uses')
      next(error)
    }
        

  }

}

export const users: Users = new Users()
