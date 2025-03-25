/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError, NotFoundError, ZodValidationError } from '@global/helpers/error-handlers'
import { Utils } from '@global/helpers/utils'
import { config } from '@root/config'
import { Schema } from 'zod'
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { Request, Response, NextFunction } from 'express'
import { StockDataSchema, editStockSchema } from '@inventory/schemes/stockValidation'
import { ALLOWED_STOCK_FIELDS, filterStockFields, IStockData, IStockDocument } from '@inventory/interfaces/stock.interfaces'
import { productService } from '@service/db/product.service'
import { stockService } from '@service/db/stock.service'
import { ActionType, createActivityLog, EntityType } from '@activity/interfaces/logs.interfaces'
import { logService } from '@service/db/logs.service'
import { ILocationDocument, StockMovement } from '@inventory/interfaces/location.interfaces'
import { locationService } from '@service/db/location.service'
import { omit } from 'lodash'
import { movementSchema } from '@inventory/schemes/locationValidation'
import { supplierService } from '@service/db/supplier.service'


const log = config.createLogger('stockController')

export class Stock {

  constructor() {
    this.create = this.create.bind(this)
    this.read = this.read.bind(this)
    this.edit = this.edit.bind(this)
    this.fetch = this.fetch.bind(this)
    this.move = this.move.bind(this)
    this.low = this.low.bind(this)
    this.fetchBySupplier = this.fetchBySupplier.bind(this)
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

      const existingUser = req.user!
    
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

      // Check if location exist
      let location: ILocationDocument | null = null
      if (body.locationId) {
        location = await locationService.getById(new ObjectId(body.locationId))
      }
      const stockId: ObjectId = new ObjectId()
      const locationId: ObjectId = new ObjectId()

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
  * Constructs the Stock document for a new product.
  * @param data Stock data
  * @param stockId ObjectId of the stock
  * @param userId ObjectId of the user
  * @returns product document conforming to IStockDocument interface
  */
  private stockData(data: IStockData, stockId: string | ObjectId, userId: string | ObjectId, productId: string | ObjectId, locationId: string | ObjectId): IStockDocument {
    return {
      _id: stockId,
      businessId: new ObjectId(data.businessId),
      productId: new ObjectId(productId),
      locationId: new ObjectId(locationId),
      unitsAvailable: data.unitsAvailable,
      compartment: data.compartment || '',
      maxQuantity: data.maxQuantity,
      minQuantity: data.minQuantity,
      thresholdAlert: data.thresholdAlert,
      costPerUnit: data.costPerUnit,
      notes: data.notes,
      updatedBy: userId,
      createdBy: userId,
      totalValue: data.totalValue,
      supplierId: data.supplierId
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
      const existingUser = req.user!

      // fetch stockData
      const stockData = await stockService.fetchAll(`${existingUser.associatedBusinessesId}`)
      const transformedStocks = this.transformStocks(stockData)

      const message = stockData.length? 'Stocks data fetched successfully' : 'No stock data found'
      res.status(HTTP_STATUS.OK).json({ message, data: transformedStocks })

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
      const existingUser = req.user!

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

      const existingUser = req.user!

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

      const body = Utils.sanitizeInput(req.body)
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

      const existingUser = req.user!

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

      const destinationLocation =  await locationService.getById(new ObjectId(destination))
      if (!destinationLocation) {
        return next(new NotFoundError('location data not found for this destination'))
      }

      stock.unitsAvailable =  stock.unitsAvailable - quantity
      await stock.save()
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

      destinationLocation.stocks.push(stock._id)
      // Save location changes
      await destinationLocation.save()

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
      const locationData = location.toJSON()
      if (locationData.stockMovements.length) {
        locationData.stockMovements = 
        locationData.stockMovements.map((sm: any) => {
          sm.product = sm.productId.productName
          sm.destination = sm.destination.locationName
          sm.initiatedBy = sm.initiatedBy.name
          delete sm.productId
          delete sm._id
          return sm
        })

        // Respond to client
        res.status(HTTP_STATUS.OK).json({
          status: 'success',
          message: `Updated stock movement for product '${product?.productName}' successfully`,
          data: omit(locationData, ['_id', 'createdAt', '__v"']),
        }) 
      }
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
      const existingUser = req.user!

      // fetch low stock data
      const stocks = await stockService.lowStock(existingUser.associatedBusinessesId)
      const transformedStocks = this.transformStocks(stocks)

      const message = transformedStocks.length? 'Low stocks data fetched successfully' : 'No low stock data found'
      res.status(HTTP_STATUS.OK).json({ message,  data: transformedStocks})

    } catch (error: any) {
      log.error(`Error fetching low stock data: ${error.message}`)
      next(error) 
    }
  }


  public async fetchBySupplier(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { supplierId } = req.params
      const user = req.user!

      const supplier = await supplierService.findById(new ObjectId(supplierId))
      if (!supplier) {
        return next(new NotFoundError('Supplier not found'))
      }
      const stocks = await stockService.findBySupplier(new ObjectId(user.associatedBusinessesId), supplier._id)
      const transformedStocks = this.transformStocks(stocks)
      
      const message = transformedStocks.length? 'stock data fetched successfully' : 'No stock data found for this supplier'
      res.status(HTTP_STATUS.OK).json({ message,  data: transformedStocks})

    } catch (error: any) {
      log.error(`Error fetching stock data by supplier: ${error.message}`)
      next(error) 
    }
  }

  private transformStocks(stocks: any[]): any[] {
    if (!stocks) return []
  
    return stocks.map(stock => {
      const stockData = stock.toJSON()
  
      if (stockData.productId) {
        stockData.product = {
          name: stockData.productId.productName,
          id: stockData.productId._id
        }
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
  
      if (stockData.supplierId) {
        stockData.supplier = stockData.supplierId.name
        delete stockData.supplierId
      } else {
        stockData.supplier = null
        delete stockData.supplierId
      }

      if (stockData.updatedBy) {
        stockData.updatedBy = stockData.updatedBy.name
      } else {
        stockData.updatedBy = null
      }
  
      return omit(stockData, ['createdBy', 'createdAt', '__v', 'businessId', '_id'])
    })
  }
  
}

export const stock: Stock = new Stock()