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
import { v4 as uuidv4 } from 'uuid'


export class Register {
    public async create(req: Request, res: Response, next: NextFunction ): Promise<void> {
      const parsedDataOrError = Utils.schemaParser(registerSchema, req.body)

      if (parsedDataOrError !== true) {
        return next(new ZodValidationError(parsedDataOrError.toString()))
      }

      const { email, username, password, businessName, businessLogo } = req.body
      const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameAndBusinessEmail(username, email)
      if (checkIfUserExist) {
        return next(new BadRequestError('Invalid credentials'))
        }

        const authObjectId: ObjectId = new ObjectId()
        const businessObjectId: ObjectId = new ObjectId()
        const uId = `${Utils.generateRandomIntegers(12)}`
    
        const authData: IAuthDocument = Register.prototype.RegisterBusinessData({
            _id: authObjectId,
            uId,
            username,
            businessName,
            email,
            password,
          })

          try {
            if (businessLogo) {
              const uploadResult = await uploads(businessLogo, businessObjectId.toString(), true, true)
              if (!uploadResult?.public_id) {
                return next(new BadRequestError('File Error: Failed to upload business logo. Please try again.'))
              }
            }
            // ...rest of logic
          } catch (error) {
            return next(new BadRequestError(`File Upload Error: ${error instanceof Error ? error.message : 'Unknown error occurred.'}`))
          }
          
          
          res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully', authData})
      }   

      private RegisterBusinessData (data: IRegisterBusinessData): IAuthDocument {
          const { username, businessName, email, password, uId, _id } = data

          return {
              _id,
              uId,
              email: Utils.lowerCase(email),
              username:  Utils.firstLetterToUpperCase(username),
              password, 
              businessId: uuidv4(),
              businessName,
              createdAt: new Date()
          } as IAuthDocument
        }
}


