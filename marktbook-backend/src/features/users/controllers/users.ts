import { businessCache } from '@service/redis/business.cache'
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import { ZodValidationError, NotFoundError, NotAuthorizedError, ServerError, BadRequestError } from '@root/shared/globals/helpers/error-handlers'
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


const log  = config.createLogger('userController')


class Users {
    constructor(){
        this.UserData = this.UserData.bind(this)
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

        // validate incoming data
        const parsedDataOrError = Utils.schemaParser(userSchema, req.body)
        if (parsedDataOrError !== true) {
            log.warn('Validation failed:', parsedDataOrError.toString())
            return next(new ZodValidationError(parsedDataOrError.toString()))
        }
        // validate user
        const cachedUser = await userCache.getUserfromCache(`${req.currentUser?.userId}`) as IuserDocument
        const existingUser = cachedUser? cachedUser 
            : await userService.getUserById(`${req.currentUser?.userId}`) as IuserDocument

        if(existingUser?.status !== 'active' || !( existingUser?.role === 'Owner' || existingUser?.role === 'Manager')) {
            return next(new NotAuthorizedError('Invalid User') )
            
        }
        // sanitize input
        const body = Utils.sanitizeInput(req.body) as IuserData
        const { email, username, mobileNumber, name, role, status, address, nin, businessId } = body 

        // Check if user account already exist
       const checkExistingAccount: IuserDocument | null = await userService.getUserByUsernameAndEmail(username, email)
       if (checkExistingAccount) {
           log.warn(`User registration failed: Account with username "${username}" and email "${email}" already exists.`)
           return next(new BadRequestError('User account with this name or email already exists.'))
           }

        // validate business
       const cachedBusiness = await businessCache.getBusinessFromCache(`${businessId}`) as IBusinessDocument
       const existingBusiness = cachedBusiness? cachedBusiness
       : await businessService.getBusinessById(`${businessId}`) as IBusinessDocument

       if(!existingBusiness) {
            return next(new NotFoundError('Invalid Business: business not found') )
       } else if (existingBusiness._id.toString() !== existingUser.associatedBusinessesId.toString()) {
            return next(new NotAuthorizedError('Invalid Business: not authorized for this business') )
       }

        // Generate unique identifiers
        const newUserId: ObjectId = new ObjectId()
        const authObjectId: ObjectId = new ObjectId()
        const password = Utils.generateRandomIntegers(9).toString()

      // Prepare authentication data
      const authData = {
        _id: authObjectId,
        email,
        adminFullName: name,
        username,
        password,
        businessName: existingBusiness.businessName!,
        businessAddress: existingBusiness.businessAddress!,
        businessType: existingBusiness.businessType!,
        businessCategory: existingBusiness.businessCategory!,
        businessLogo: existingBusiness.businessLogo || '',
      } as IAuthDocument

      const userData: IuserDocument = this.UserData(authData, nin, newUserId, new ObjectId(businessId), status, address, role, mobileNumber)
      const adminData = {
        userId: newUserId,
        username,
        name,
        role,
        status
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

     log.info(`User '${name} account created successfully`)
    // Respond to client
      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: `User '${name} account created successfully`,
        data: userData
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        log.error(`User registration failed: ${error.message}`)
        next(error)
      }
  
    }

    private UserData(data: IAuthDocument, nin: string = '',
        userObjectId: ObjectId, businessObjectId: ObjectId, 
        status: string, address: string = '',
        role: string, mobileNumber: string='' ): IuserDocument {
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
        
        // validate user
        const cachedUser = await userCache.getUserfromCache(`${req.currentUser?.userId}`) as IuserDocument
        const existingUser = cachedUser? cachedUser 
             : await userService.getUserById(`${req.currentUser?.userId}`) as IuserDocument
 
         if(existingUser?.status !== 'active' || !( existingUser?.role === 'Owner' || existingUser?.role === 'Manager')) {
             return next(new NotAuthorizedError('Invalid User') )
      }

      let users = await userService.getAllUsers(existingUser.associatedBusinessesId)
      if (users) {
        users = users.filter(user => user._id !== existingUser._id)
      }

      res.status(HTTP_STATUS.OK).json({data: users})

    }









}







export const users: Users = new Users()