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



export const log = config.createLogger('saleController')

class Sale extends Product {
  constructor(){
    super()
    this.new = this.new.bind(this)
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

      await saleService.newSale(salesData)

      res.status(HTTP_STATUS.CREATED).json({
        message: 'Sale completed successfully',
        data: salesData,
        status: 'success'
      })

    } catch (error: any) {
      log.error(`sale attempt failed ${error.message}`)
      next(error)
    }
  }


  private saleData(data: ISaleData, saleId: ObjectId, user: IuserDocument): ISaleDocument {
    return {
      _id: saleId,
      customerId: data.customerId ?? undefined,
      businessId: new ObjectId(user.associatedBusinessesId),
      initiatedBy: new ObjectId(user._id),
      completedBy: undefined,
      subtotalAmount: data.subtotalAmount,
      taxAmount: data.taxAmount,
      taxRate: data.taxRate,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      discount: data.discount,
      status: data.status,
      refundStatus: 'NONE',
      saleItems: data.saleItems,
      totalPrice: data.totalPrice
    } as ISaleDocument
  }
  

  protected async updateStock(saleItems: SaleItem[]): Promise<void> {
    const bulkOperations = saleItems.map(({ productId, quantity }) => ({
      updateOne: {
        filter: {
          productId,
          unitsAvailable: { $gte: quantity }
        },
        update: { $inc: { unitsAvailable: -quantity } },

      }
    }))
  
    const result = await stockService.bulkUpdate(bulkOperations)
    if (result.modifiedCount < saleItems.length) {
      throw new NotFoundError('Some products in the sale could not be found or have insufficient stock.')
    }
  }
  


}

export const sale: Sale = new Sale()