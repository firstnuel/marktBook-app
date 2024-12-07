import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response,NextFunction } from 'express'
import { ZodValidationError, BadRequestError } from '@root/shared/globals/helpers/error-handlers'
import { registerSchema } from '@auth/schemes/authValidation'
import { IAuthDocument, IRegisterBusinessData } from '@auth/interfaces/auth.interface'
import { authService } from '@root/shared/services/db/auth.service'
import { Utils } from '@root/shared/globals/helpers/utils'
// import { UploadApiResponse } from 'cloudinary'
import { uploads } from '@root/shared/globals/helpers/cloudinary-upload'
import { IBusinessDocument } from '@business/interfaces/business.interface'
import { config } from '@root/config'
import { BusinessCache } from '@service/redis/business.cache'

const businessCache: BusinessCache = new BusinessCache()

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
      const businessObjectId: ObjectId = new ObjectId()
      const uId = `${Utils.generateRandomIntegers(12)}`
  
      const authData: IAuthDocument = this.RegisterBusinessData({
        _id: authObjectId,
        uId,
        email,
        adminFullName,
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
      const businessDataForCache: IBusinessDocument = this.BusinessData(authData, businessObjectId)
      businessDataForCache.businessLogo = `https://res/cloudinary/${config.CLOUD_NAME}/image/upload/v${uploadResult.version}/${uploadResult.public_id}`

      await businessCache.saveBusinessToCache(`${businessObjectId}`, uId, businessDataForCache)
      // const savedResult = await businessCache.retrieveBusinessFromCache(`${businessObjectId}`)


      res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', authData})
    }   

    private RegisterBusinessData(data: IRegisterBusinessData): IAuthDocument {
      const { 
        businessName, 
        email, 
        password, 
        uId, 
        _id, 
        adminFullName, 
        businessAddress, 
        businessType, 
        businessCategory, 
        businessLogo 
      } = data
    
      return {
        _id,
        uId,
        email: Utils.lowerCase(email),
        adminFullName: Utils.firstLetterToUpperCase(adminFullName),
        password, 
        businessName: Utils.firstLetterToUpperCase(businessName),
        businessAddress,
        businessType,
        businessCategory,
        businessLogo,
        createdAt: new Date()
      } as IAuthDocument
    }

    private BusinessData(data: IAuthDocument, businessObjectId: ObjectId): IBusinessDocument {
      const {         
        businessName, 
        email, 
        password, 
        uId, 
        _id, 
        businessAddress, 
        businessType, 
        businessCategory, 
       } = data
      const ownerId: ObjectId = new ObjectId()

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
          role: 'Owner',
          addedAt: new Date(),
          status: 'active'
          }
      ],
        password,
        businessLogo: '',
        uId,
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
        bgImageId: ''
      } as IBusinessDocument
    }
}


