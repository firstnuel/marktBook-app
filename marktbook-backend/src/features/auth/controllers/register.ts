import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response,NextFunction } from 'express'
import { ZodValidationError, BadRequestError } from '@root/shared/globals/helpers/error-handlers'
import { registerSchema } from '@auth/schemes/authValidation'
import { IAuthDocument, IRegisterBusinessData } from '@auth/interfaces/auth.interface'
import { authService } from '@root/shared/services/db/auth.service'
import { Utils } from '@root/shared/globals/helpers/utils'
import { uploads } from '@root/shared/globals/helpers/cloudinary-upload'
import { IBusinessDocument } from '@business/interfaces/business.interface'
import { config } from '@root/config'
import { BusinessCache } from '@service/redis/business.cache'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import { UserCache } from '@service/redis/user.cache'
import { omit } from 'lodash'
import { authQueue } from '@service/queues/auth.queue'
import { userQueue } from '@service/queues/user.queue'
import { businessQueue } from '@service/queues/business.queue'

const businessCache: BusinessCache = new BusinessCache()
const userCache: UserCache = new UserCache()

export class Register {
  constructor() {
    this.create = this.create.bind(this)
  }

  public async create(req: Request, res: Response, next: NextFunction ): Promise<void> {
    const parsedDataOrError = Utils.schemaParser(registerSchema, req.body)

    if (parsedDataOrError !== true) {
      return next(new ZodValidationError(parsedDataOrError.toString()))
    }
    const { 
      email, 
      password, 
      businessName, 
      username,
      businessLogo, 
      adminFullName, 
      businessAddress, 
      businessType, 
      businessCategory 
    } = req.body

    const checkIfBusinessExist: IAuthDocument = await authService.getBusinessByNameAndEmail(businessName, email)
    
    if (checkIfBusinessExist) {
      return next(new BadRequestError('Invalid credentials'))
      }

      const authObjectId: ObjectId = new ObjectId()
      const ownerId: ObjectId = new ObjectId()
      const businessObjectId: ObjectId = new ObjectId()
      const userUId = `${Utils.generateRandomIntegers(12)}`
      const businessUId = `${Utils.generateRandomIntegers(12)}`
  
      const authData: IAuthDocument = this.RegisterBusinessData({
        _id: authObjectId,
        uIds: {userUId, businessUId},
        email,
        adminFullName,
        username,
        password,
        businessName,
        businessAddress,
        businessType,
        businessCategory,
        businessLogo
        })

      const uploadResult = await uploads(businessLogo, `${businessObjectId}`, true, true)
      if (!uploadResult?.public_id) {
        return next(new BadRequestError('File Error: Failed to upload business logo. Please try again.'))
      }
      // Add to redis cache
      const businessDataForCache: IBusinessDocument = this.BusinessData(authData, businessObjectId, ownerId)
      businessDataForCache.businessLogo = `https://res/cloudinary/${config.CLOUD_NAME}/image/upload/v${uploadResult.version}/${uploadResult.public_id}`

      const userDataForCache: IuserDocument = this.UserData(authData, ownerId, businessObjectId)
      await userCache.saveUserToCache(`${ownerId}`, userUId, userDataForCache)

      await businessCache.saveBusinessToCache(`${businessObjectId}`, businessUId, businessDataForCache)
      const savedResult = await businessCache.retrieveBusinessFromCache(`${businessObjectId}`)

      // Add to Database
      omit(userDataForCache, ['uId'])
      omit(businessCache, ['uId'])
      authQueue.addAuthUserJob('addAuthUserToDb', { value: authData })
      userQueue.addUserJob('addUserToDb', { value: userDataForCache })
      businessQueue.addBuisnessJob('addBusinessToDb', { value: businessDataForCache })

      res.status(HTTP_STATUS.CREATED).json({ message: 'Business account and user created successfully', savedResult})
    }   

    private RegisterBusinessData(data: IRegisterBusinessData): IAuthDocument {
      const { businessName, email, password, uIds, _id,  username, adminFullName, businessAddress, businessType, businessCategory, businessLogo  } = data
    
      return {
        _id,
        uIds,
        email: Utils.lowerCase(email),
        adminFullName: Utils.firstLetterToUpperCase(adminFullName),
        password, 
        username: Utils.firstLetterToUpperCase(username),
        businessName: Utils.firstLetterToUpperCase(businessName),
        businessAddress,
        businessType,
        businessCategory,
        businessLogo,
        createdAt: new Date()
      } as IAuthDocument
    }

    private BusinessData(data: IAuthDocument, businessObjectId: ObjectId, ownerId: ObjectId ): IBusinessDocument {
      const { businessName, email, username, adminFullName, uIds, _id, businessAddress, businessType, businessCategory } = data

      return {
        _id: businessObjectId,
        verifiedStatus: false,
        verifyData: {
          owner: '',
          TIN: '',
          CAC: '',
          location: ''
        },
        authId: _id,
        businessName,
        email,
        admins: [
          {
          userId: ownerId,
          username,
          name: adminFullName,
          role: 'Owner',
          addedAt: new Date(),
          status: 'active'
          }
      ],
        businessLogo: '',
        uId: uIds.businessUId,
        businessCategory,
        businessAddress,
        businessType,
        businessAccount: {
          accountName: '',
          accountNumber: '',
          bankName: '',
          accountType: ''
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
          website: ''
        },
        bgImageVersion: '',
        bgImageId: '',
        createdAt: new Date(),

      } as IBusinessDocument
    }

    private UserData(data: IAuthDocument, userObjectId: ObjectId,  businessObjectId: ObjectId): IuserDocument {
      const {
        username,
        businessName,
        adminFullName,
        uIds,
        email

      } = data

      return {
        _id: userObjectId,
        name: adminFullName,
        uId: uIds.userUId,
        email,
        mobileNumber: '',
        role: 'Owner',
        status: 'active',
        address: '',
        nin: '',
        username,
        associatedBusinessesId: businessObjectId,
        associatedBusinesses: [
          {
            businessId: businessObjectId,
            businessName,
            role: 'Owner'
          }
        ],
        emergencyContact: {
          name: '',
          relationship: '',
          contactNumber: ''
        },
        createdAt: new Date(),
        updatedAt:undefined,
        lastLogin: undefined,
        notificationPreferences: {
          emailNotifications: true,
          smsNotifications: true,
        },
        languagePreference: 'english',
        isVerified: false,
        profilePicture: ''
      } as IuserDocument
    }

}


