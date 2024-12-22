/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from 'http-status-codes'
import { config } from '@root/config'
import { ObjectId } from 'mongodb'
import { Utils } from '@root/shared/globals/helpers/utils'
import { Product } from '@inventory/controllers/products'
import { salesDataSchema } from '@transactions/schemes/salesValidation'
import { ISaleData, ISaleDocument, SaleItem, validateTotals } from '@transactions/interfaces/sales.interface'
import { stockService } from '@service/db/stock.service'
import { BadRequestError, NotFoundError } from '@global/helpers/error-handlers'
import { IuserDocument } from '@users/interfaces/user.interface'
import { saleService } from '@service/db/sale.service'
import { omit } from 'lodash'


export const log = config.createLogger('saleController')

class Sale extends Product {
  constructor(){
    super()
    this.new = this.new.bind(this)
    this.read = this.read.bind(this)
    this.fetch = this.fetch.bind(this)
  }
  /**
   * Handles the make a new sale.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
  */
  public async new(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      log.info('new sale attempt implemented')

      // validate input
      this.validateInput(salesDataSchema, req.body)

      // Validate user
      const user = await this.validateUser(`${req.currentUser?.userId}`)

      // Sanitize input
      const body = Utils.sanitizeInput(req.body) as ISaleData

      // update stock 
      await this.updateStock(body.saleItems)

      const salesData: ISaleDocument = this.saleData(body, new ObjectId(), user)

      // validate totals
      const valid = validateTotals(salesData)
      if (!valid) {
        return next(new BadRequestError('The total price is not correct'))
      }
      // Save the sale to the database
      const savedData = await saleService.newSale(salesData)

      // Remove sensitive fields before sending response
      const resData = omit(savedData.toJSON(), ['businessId', 'customerId', 'initiatedBy', 'updatedAt'])

      // Send success response
      res.status(HTTP_STATUS.CREATED).json({
        message: 'Sale completed successfully',
        data: resData,
        status: 'success'
      })

    } catch (error: any) {
      log.error(`sale attempt failed ${error.message}`)
      next(error)
    }
  }

  // Helper method to format sale data with required fields
  private saleData(data: ISaleData, saleId: ObjectId, user: IuserDocument): ISaleDocument {
    return {
      _id: saleId,
      customerId: data.customerId ?? undefined,
      customerName: data.customerName,
      businessId: new ObjectId(user.associatedBusinessesId),
      initiatedBy: new ObjectId(user._id),
      completedBy: undefined,
      subtotalAmount: data.subtotalAmount,
      taxAmount: data.taxAmount,
      paymentRef: data.paymentRef,
      taxRate: data.taxRate,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      discount: data.discount,
      status: data.status,
      refundStatus: 'NONE',
      saleItems: data.saleItems,
      totalPrice: data.totalPrice,
    } as ISaleDocument
  }
  

  protected async updateStock(saleItems: SaleItem[]): Promise<void> {
    // validate stock quantity
    for (const { productId, quantity, productName } of saleItems) {
      const stock = await stockService.getByProductID(productId)
      if(!stock) {
        throw new NotFoundError(`No stock data found for product '${productName}'`)
      } else if(stock.unitsAvailable < quantity) {
        throw new BadRequestError(`Insufficient stock for '${productName}'. Requested quantity exceeds available units.`)
      }
    }

    // bulk update stock
    const bulkOperations = saleItems.map(({ productId, quantity }) => ({
      updateOne: {
        filter: {
          productId,
          unitsAvailable: { $gte: quantity }
        },
        update: { $inc: { unitsAvailable: -quantity } },

      }
    }))

    await stockService.bulkUpdate(bulkOperations)

  }

  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate user
      const user = await this.validateUser(`${req.currentUser?.userId}`)

      const sales = await saleService.getAll(new ObjectId(user.associatedBusinessesId))
      const message = sales.length? 'Sales data fetched successfully' : 'No sales data found'

      //remove sensitive fields
      const salesData = sales
        .map(sale => omit(sale.toJSON(), ['businessId', 'customerId', 'initiatedBy', 'updatedAt']))

      res.status(HTTP_STATUS.OK).json({ 
        status: sales.length? 'success': undefined,
        message,
        data: salesData
      })

    } catch (error: any) {
      log.error(`Failed to fetch sales: ${error.message}`)
      next(error)
    }
  }

  public async fetch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate user
      const user = await this.validateUser(`${req.currentUser?.userId}`)

      const { id } = req.params

      const saleData = await saleService.getById(new ObjectId(id), new ObjectId(user.associatedBusinessesId))

      if (!saleData){
        return next(new NotFoundError('Sale not found'))
      }
      res.status(HTTP_STATUS.OK).json({
        status: 'success', 
        message: 'Sale retrieved successfully', 
        data: saleData })
    } catch (error: any) {
      log.error(`Failed to fetch sale: ${error.message}`)
      next(error)
    }
  }
  
}

export const sale: Sale = new Sale()