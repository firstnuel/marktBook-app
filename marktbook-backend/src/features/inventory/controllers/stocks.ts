/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError, NotAuthorizedError, NotFoundError, ZodValidationError } from '@global/helpers/error-handlers'
import { Utils } from '@global/helpers/utils'
import { config } from '@root/config'
import { Schema } from 'zod'
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import { StockDataSchema, editStockSchema } from '@inventory/schemes/stockValidation'
import { IuserDocument } from '@users/interfaces/user.interface'
import { userCache } from '@service/redis/user.cache'
import { userService } from '@service/db/user.service'
import { ALLOWED_STOCK_FIELDS, filterStockFields, IStockData, IStockDocument } from '@inventory/interfaces/stock.interfaces'
import { productService } from '@service/db/product.service'
import { IBusinessDocument } from '@business/interfaces/business.interface'
import { businessService } from '@service/db/business.service'
import { businessCache } from '@service/redis/business.cache'
import { stockService } from '@service/db/stock.service'
import { ActionType, createActivityLog, EntityType } from '@activity/interfaces/logs.interfaces'
import { logService } from '@service/db/logs.service'
import { ILocationDocument, StockMovement } from '@inventory/interfaces/location.interfaces'
import { locationService } from '@service/db/location.service'
import { omit } from 'lodash'
import { movementSchema } from '@inventory/schemes/locationValidation'

const log = config.createLogger('stockController')

export class Stock {

  constructor() {
    this.create = this.create.bind(this)
    this.read = this.read.bind(this)
    this.edit = this.edit.bind(this)
    this.fetch = this.fetch.bind(this)
    this.move = this.move.bind(this)
    this.low = this.low.bind(this)
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

      // CHeck if stockData exist for product
      const stock = await stockService.getByProductID(product._id)
      if (stock) return next(new BadRequestError(`Stock Data already exist for this product ${product.productName}`))

      // Validate business
      await this.validateBusiness(body.businessId.toString(), existingUser)

      const stockId: ObjectId = new ObjectId()
      const locationId: ObjectId = new ObjectId()

      // Check if location exist
      const location = await locationService.findByName(body.locationName, new ObjectId(body.businessId))
      if (location) {
        location.stocks.push(stockId)
        await location.save()
      } else {
        // save locationData
        const locationData: ILocationDocument = this.locationData(body, stockId, existingUser._id, locationId)
        await locationService.addLocation(locationData)
      }

      // save stockData
      const stockData: IStockDocument = this.stockData(body, stockId, existingUser._id, product._id, location?._id || locationId)
      await stockService.createStock(stockData)

      // update product
      await productService.editStockId(product._id.toString(), stockId)

      // log activity
      const logData = createActivityLog (
        existingUser._id, 
        existingUser.username, 
        existingUser.associatedBusinessesId, 
        'CREATE' as ActionType, 
        'STOCK' as EntityType,
        `${stockId}`,
        `Created stock info for '${product.productName}'`)
      
      await logService.createLog(logData)

      const Data = { ...stockData, locationName: body.locationName, address: body.address }

      res.status(HTTP_STATUS.CREATED).json({
        message: `Stock and location info for '${product.productName}' added successfully`,
        data: Data,
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
  * Constructs the Stock document for a new product.
  * @param data Stock data
  * @param stockId ObjectId of the stock
  * @param userId ObjectId of the user
  * @returns product document conforming to IStockDocument interface
  */
  private stockData(data: IStockData, 
    stockId: string | ObjectId, 
    userId: string | ObjectId, 
    productId: string | ObjectId ,
    locationId:  string | ObjectId 
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
      supplierId,
      compartment,
    } = data

    return {
      _id: stockId,
      businessId: new ObjectId(businessId),
      productId: new ObjectId(productId),
      locationId: new ObjectId(locationId),
      unitsAvailable,
      compartment: compartment || '',
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


  /**
  * Constructs the location document for a new product.
  * @param data Stock data
  * @param stockId ObjectId of the stock
  * @param locationId ObjectId of the location
  * @param userId ObjectId of the user
  * @returns product document conforming to ILocationDocument interface
  */
  protected locationData(data: IStockData, 
    stockId: ObjectId, 
    userId: string | ObjectId, 
    locationId: ObjectId, 
    currentLoad: number = 0,
    manager: string =''
  ): ILocationDocument {
    const { locationName, locationType, address, locationStatus, capacity, businessId} =  data

    return {
      _id: locationId,
      stocks: [ stockId ],
      locationName: Utils.firstLetterToUpperCase(locationName),
      businessId: new ObjectId(businessId),
      locationType,
      address,
      currentLoad,
      capacity: capacity === 0 ? undefined : capacity,
      manager: manager? new ObjectId(manager) :new ObjectId(userId),
      locationStatus,
      stockMovements:[],
    } as unknown as ILocationDocument
  }


  /**
  * Handles the returning of all StockData.
  * @param req Express Request object
  * @param res Express Response object
  * @param next Express NextFunction for error handling
  */

  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      // validate user 
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      // fetch stockData
      const stockData = await stockService.fetchAll(`${existingUser.associatedBusinessesId}`)

      const message = stockData.length? 'Stocks data fetched successfully' : 'No stock data found'
      res.status(HTTP_STATUS.OK).json({ message, data: stockData })

    } catch(error) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching stock')
      next(error)
    }
  }


  /**
  * Handles the returning StockData for a Product.
  * @param req Express Request object
  * @param res Express Response object
  * @param next Express NextFunction for error handling
  */
  public async fetch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      // validate user 
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      const { productId } = req.params 

      // Check if product exist
      const product = await productService.getById(`${productId}`, `${existingUser.associatedBusinessesId}`)
      if (!product) {
        return next(new NotFoundError('Product not found'))
      }

      // check if stock exist 
      const stock = await stockService.getByProductID(new ObjectId(product._id))
      if (!stock) {
        return next(new NotFoundError('Stock data not found for this product'))
      }
      // transform data
      const stockData = stock.toObject()
      if (stockData.locationId) {
        stockData.locationData = omit(stockData.locationId, ['_id', 'id', 'calculatedLoad'])
        delete stockData.locationId
      }

      const returnData = omit(stockData,
        ['_id', 'stockId', 'manager', 'locationStatus', 'updatedAt',
          'updatedBy',  'createdBy', 'createdAt', '__v', 'businessId', 'productId'])


      res.status(HTTP_STATUS.OK).json({
        message: 'Product stock data fetched successfully', 
        data: returnData 
      })

    } catch(error) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching stock')
      next(error)
    }
  }


  /**
   * Handles editing stock for a product
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */

  public async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      // validate input
      this.validateInput(editStockSchema, req.body)

      const { productId } = req.params 

      // validate requesting user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)
      if (existingUser.role === 'Staff') {
        return next(new NotAuthorizedError('Not Authorized: User not authorized to edit stock'))
      }

      // Check if product exist
      const product = await productService.getById(`${productId}`, `${existingUser.associatedBusinessesId}`)
      if (!product) {
        return next(new NotFoundError('Product not found'))
      }

      // check if stock exist 
      const stock = await stockService.getByProductID(new ObjectId(product._id))
      if (!stock) {
        return next(new NotFoundError('Stock data not found for this product'))
      }

      // sanitize the input data
      const body = Utils.sanitizeInput(req.body)

      // validate business
      await this.validateBusiness(stock.businessId.toString(), existingUser)
      const filteredData = filterStockFields(body, ALLOWED_STOCK_FIELDS)

      filteredData.updatedAt = new Date()
      filteredData.updatedBy = new ObjectId(existingUser._id)

      // check if restocked
      if (body.unitsAvailable > stock.unitsAvailable) {
        filteredData.lastRestocked =  new Date()
      }
      // Perform update
      const updateStockData = await stockService.editStock(new ObjectId(stock._id), filteredData)

      // log update
      const logData = createActivityLog (
        existingUser._id, 
        existingUser.username, 
        existingUser.associatedBusinessesId, 
        'EDIT' as ActionType, 
        'STOCK' as EntityType,
        `${updateStockData?._id}`,
        `Edited stock for product '${product?.productName}'`)

      await logService.createLog(logData)

      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Product stock data updated successfully',
        data: updateStockData,
      })

    } catch (error: any) {
      log.error(`Error updating stock data: ${error.message}`)
      next(error)
    }
  }


  /**
   * Handles movement of stock to another location
   * @param req Express Request Object
   * @param res Express Response Object
   * @param next Express NextFunction for error handling
   */

  public async move(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate input and sanitize input
      this.validateInput(movementSchema, req.body)
      const { productId, movementType, quantity, destination, reason } = Utils.sanitizeInput(req.body)

      // validate requesting user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      // Check if product exist
      const product = await productService.getById(`${productId}`, `${existingUser.associatedBusinessesId}`)
      if (!product) return next(new NotFoundError('Product not found'))

      const stock = await stockService.getByProductID(new ObjectId(product._id))
      if (!stock)  return next(new NotFoundError('Stock data not found for this product'))

      // Ensure sufficient stock for 'OUT' movement
      if (movementType === 'OUT' && quantity > stock.unitsAvailable) {
        return next(new BadRequestError('Insufficient stock for the requested movement'))
      }
      
      // Fetch location data
      const location = await locationService.getById(new ObjectId(stock.locationId))
      if (!location) {
        return next(new NotFoundError('location data not found for this product'))
      }

      // Update stock movement
      location.stockMovements.push(
        {
          productId: new ObjectId(product._id),
          movementType,
          quantity,
          destination: new ObjectId(destination as string),
          initiatedBy: new ObjectId(existingUser._id),
          reason
        } as StockMovement
      )
      // Save location changes
      await location.save()

      // Log the activity
      const logData = createActivityLog (
        existingUser._id, 
        existingUser.username, 
        existingUser.associatedBusinessesId, 
        'UPDATE' as ActionType, 
        'LOCATION' as EntityType,
        `${location?._id}`,
        `Updated stock movement for product '${product?.productName}'`)

      await logService.createLog(logData)

      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: `Updated stock movement for product '${product?.productName}' successfully`,
        data: omit(location.toJSON(), ['_id', 'createdAt', '__v"']),
      }) 
    } catch (error: any) {
      log.error(`Error moving stock: ${error.message}`)
      next(error)
    }
  }

  /**
   * Handles fetching low StockData
   * @param req Express Request Object
   * @param res Express Response Object
   * @param next Express NextFunction for error handling
   */

  public async low(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate user 
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)
      if (existingUser.role === 'Staff') {
        return next(new NotAuthorizedError('Not Authorized: User not authorized to fetch low stock data'))
      }

      // fetch low stock data
      const stocks = await stockService.lowStock(existingUser.associatedBusinessesId)
      let transformedStocks: any[] = []
      if (stocks) {
        transformedStocks = stocks.map(stock => {
          const stockData = stock.toJSON()
          if (stockData.productId) {
            stockData.product = stockData.productId.productName
            delete stockData.productId
          } else {
            stockData.product = null
            delete stockData.productId 
          }
          if (stockData.locationId) {
            stockData.location = stockData.locationId.locationName
            delete stockData.locationId
          } else {
            stockData.location = null
            delete stockData.locationId
          }
          if (stockData.supplierId){
            stockData.supplier = stockData.supplierId.name
            delete stockData.supplierId
          } else {
            stockData.supplier = null
            delete stockData.supplierId
          }
          return omit(stockData, 
            ['createdBy', 'createdAt', '__v', 'businessId', '_id'])
        })
      }
      // const returnData = stocks.length? stocks.map(data =>
      //   omit(data.toObject(), ['createdBy', 'createdAt', '__v', 'businessId', '_id'])) : [] 

      const message = transformedStocks.length? 'Low stocks data fetched successfully' : 'No low stock data found'
      res.status(HTTP_STATUS.OK).json({ message,  data: transformedStocks})

    } catch (error: any) {
      log.error(`Error fetching low stock data: ${error.message}`)
      next(error) 
    }
  }
  
}

export const stock: Stock = new Stock()