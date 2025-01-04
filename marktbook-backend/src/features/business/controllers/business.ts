import { editBusinessSchema } from './../schemes/businessValidator'
import { singleImageUpload } from '@root/shared/globals/helpers/cloudinary-upload'
import HTTP_STATUS from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'
import { businessService } from '@service/db/business.service'
import { v4 as uuidv4 } from 'uuid'
import { config } from '@root/config'
import { Utils } from '@global/helpers/utils'
import { BadRequestError, ZodValidationError } from '@global/helpers/error-handlers'
import { filterFields, IBusinessDocument, EDIT_BUSINESS_FIELDS } from '@business/interfaces/business.interface'
import { omit } from 'lodash'

export const log = config.createLogger('businessController')

class Business {

  constructor( ) {
    this.editBusiness = this.editBusiness.bind(this)
    this.fetch = this.fetch.bind(this)
  }

  /**
   * Edit business account details
   * @param req express request object
   * @param res express response object
   * @param next express next function for middlewares
   */
  public async editBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { businessId } = req.params
      const body = Utils.sanitizeInput(req.body) as Partial<IBusinessDocument>
      
      if (Object.entries(body).length === 0) {
        throw new BadRequestError('No data provided to edit business')
      }

      const parsedDataOrError = Utils.schemaParser(editBusinessSchema, body)
      if (parsedDataOrError !== true) {
        log.warn('Validation failed:', parsedDataOrError.toString())
        throw new ZodValidationError(parsedDataOrError.toString())
      }

      const filteredData = filterFields(body, EDIT_BUSINESS_FIELDS)

      if (filteredData.businessLogo) {
        filteredData.businessLogo = await singleImageUpload(filteredData.businessLogo, businessId)
      }

      if (filteredData.bgImageId) {
        filteredData.bgImageId = await singleImageUpload(filteredData.bgImageId, uuidv4())
      }

      const editedBusinessData = await businessService.updateBusinessData(businessId, filteredData)

      // Respond to client
      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: 'Business data updated successfully',
        data: omit(editedBusinessData, ['uId', 'verifyData']), // Exclude sensitive fields
      })

    } catch (error) {
      log.error('Error editing business')
      next(error)
    }
  }

  /**
   * fetch business data by id
   * @param req express request object
   * @param res express response object
   * @param next express next function for middlewares
   */

  public async fetch(req: Request, res: Response, next: NextFunction):Promise<void> {
    try{
      const { businessId } = req.params

      const businessData = await businessService.getBusinessById(businessId)

      // Respond to client
      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: 'Business data fetched successfully',
        data: omit(businessData, ['uId', 'verifyData']), // Exclude sensitive fields
      })


    } catch (error) {
      log.error('Error fetching business data')
      next(error)
    }
  }

}


export const business = new Business()