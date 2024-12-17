/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotAuthorizedError, NotFoundError, ZodValidationError } from '@global/helpers/error-handlers'
import { Utils } from '@global/helpers/utils'
import { config } from '@root/config'
import { ZodType as Schema } from 'zod'
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import { StockDataSchema } from '@inventory/schemes/stockValidation'
import { IuserDocument } from '@users/interfaces/user.interface'
import { userCache } from '@service/redis/user.cache'
import { userService } from '@service/db/user.service'
import { IStockData, IStockDocument } from '@inventory/interfaces/stock.interfaces'
import { productService } from '@service/db/product.service'
import { IBusinessDocument } from '@business/interfaces/business.interface'
import { businessService } from '@service/db/business.service'
import { businessCache } from '@service/redis/business.cache'
import { stockService } from '@service/db/stock.service'
import { ActionType, createActivityLog, EntityType } from '@activity/interfaces/logs.interfaces'
import { logService } from '@service/db/logs.service'


const log = config.createLogger('productsController')

class Stock {

  constructor() {
    this.create = this.create.bind(this)
  }
    
  /**
  * Handles the creating of a new Stock.
  * @param req Express Request object
  * @param res Express Response object
  * @param next Express NextFunction for error handling
  */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      log.info('Stock creation attempt implemented')

      // validate incoming data
      this.validateInput(StockDataSchema, req.body)

      // Validate user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)
    
      // Sanitize input
      const body = Utils.sanitizeInput(req.body) as IStockData

      // Check if product exist
      const product = await productService.getById(`${body.productId}`, `${existingUser.associatedBusinessesId}`)
      if (!product) {
        return next(new NotFoundError('Product not found'))
      }

      // Validate business
      await this.validateBusiness(body.businessId.toString(), existingUser)

      const stockObjectId: ObjectId = new ObjectId()

      const stockData: IStockDocument = this.stockData(body, stockObjectId, existingUser._id, product._id)

      // save data
      await stockService.createStock(stockData)

      // update product
      await productService.editStockId(product._id.toString(), stockObjectId)

      // log activity
      const logData = createActivityLog (
        existingUser._id, 
        existingUser.username, 
        existingUser.associatedBusinessesId, 
        'CREATE' as ActionType, 
        'STOCK' as EntityType,
        `${stockObjectId}`,
        `Created stock info for '${product.productName}'`)
      
      await logService.createLog(logData)

      res.status(HTTP_STATUS.CREATED).json({
        message: `Stock info for '${product.productName}' created successfully`,
        data: stockData,
        status: 'success'
      })
    


    } catch (error: any) {
      log.error(`Product creation failed: ${error.message}`)
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
  * Protected method to validate user status
  * @param userId string
  * @returns IuserDocument
  */
  protected async validateUser(userId: string): Promise<IuserDocument> {
    const cachedUser = await userCache.getUserfromCache(userId) as IuserDocument
    const existingUser = cachedUser ? cachedUser : await userService.getUserById(userId) as IuserDocument
  
    if (!existingUser || existingUser.status !== 'active') {
      throw new NotAuthorizedError('Invalid User')
    }
  
    return existingUser
  }

  /**
   * Protected method to validate business and user authorization for it.
   * @param businessId string
   *  @param user IuserDocument
   * @returns IBusinessDocument
   */
  protected async validateBusiness(businessId: string, user: IuserDocument): Promise<IBusinessDocument> {
    const cachedBusiness = await businessCache.getBusinessFromCache(businessId) as IBusinessDocument
    const existingBusiness = cachedBusiness ? cachedBusiness :
        await businessService.getBusinessById(businessId) as IBusinessDocument
    
    if (!existingBusiness) {
      throw new NotFoundError('Invalid Business: business not found')
    } else if (existingBusiness._id.toString() !== user.associatedBusinessesId.toString()) {
      throw new NotAuthorizedError('Invalid Business: not authorized for this business')
    }
          
    return existingBusiness
  }
  
  /**
  * Constructs the product document for a new product.
  * @param data product data
  * @param stockId ObjectId of the stock
  * @param userId ObjectId of the user
  * @returns product document conforming to IProductDocument interface
  */
  private stockData(data: IStockData, 
    stockId: string | ObjectId, 
    userId: string | ObjectId, 
    productId: string | ObjectId 
  ): IStockDocument {
    const {
      businessId,
      unitsAvailable,
      maxQuantity,
      minQuantity,
      thresholdAlert,
      costPerUnit,
      notes,
      totalValue,
      locationId,
      supplierId
    } = data

    return {
      _id: stockId,
      businessId: new ObjectId(businessId),
      productId: new ObjectId(productId),
      locationId,
      unitsAvailable,
      maxQuantity,
      minQuantity,
      thresholdAlert,
      costPerUnit,
      notes,
      updatedBy: userId,
      createdBy: userId,
      totalValue,
      supplierId
    } as IStockDocument
  }
  
}

export const stock: Stock = new Stock()