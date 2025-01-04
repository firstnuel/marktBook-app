import HTTP_STATUS from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'
import { customerSchema } from '@contacts/schemes/contactsValidations'
import { config } from '@root/config'
import { Utils } from '@global/helpers/utils'
import { BadRequestError, ZodValidationError } from '@global/helpers/error-handlers'
import { ObjectId } from 'mongodb'
import { ICustomerDocument } from '@contacts/interfaces/contacts.interface'
import { customerService } from '@service/db/customer.service'
import { omit } from 'lodash'

const log = config.createLogger('customerController')

class Customer {
  /**
   * Handle creating a new customer 
   * @param req express request object
   * @param res express response object
   * @param next express next functions for middlewares
   */

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
      const body = Utils.sanitizeInput(req.body)

      const parsedDataOrError = Utils.schemaParser(customerSchema, body)
      if (parsedDataOrError !== true) {
        log.warn('Validation failed:', parsedDataOrError.toString())
        throw new ZodValidationError(parsedDataOrError.toString())
      }

      const existingCustomer = await customerService.findByName(
        Utils.firstLetterToUpperCase(body.name), 
        new ObjectId(body.businessId as string))
        
      if (existingCustomer) {
        throw new BadRequestError('Customer with this name already exists')

      }
      const customerData = {
        _id: new ObjectId(),
        businessId: new ObjectId(body.businessId as string),
        name: Utils.firstLetterToUpperCase(body.name),
        email: body.email || undefined,
        phone: body.phone || undefined, 
        address: body.address || undefined, 
        customerType: body.customerType,
        businessName: body.businessName || undefined, 
        marketingOptIn: body.marketingOptIn
      } as ICustomerDocument

      const newCustomer = await customerService.addCustomer(customerData)

      // Respond to client
      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: 'Customer data created successfully',
        data: omit(newCustomer.toObject(), ['createdAt', 'updatedAt', '__v'])
      })

    } catch (error) {
      log.error(`Error occurred while creating customer ${(error as Error).message}`)
      next(error)
    }

  }
}


export const customer = new Customer()