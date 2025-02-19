import HTTP_STATUS from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'
import { customerSchema, editCustomerSchema } from '@contacts/schemes/contactsValidations'
import { config } from '@root/config'
import { Utils } from '@global/helpers/utils'
import { BadRequestError, NotAuthorizedError, ZodValidationError } from '@global/helpers/error-handlers'
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

      const existingCustomer = await customerService.findByEmail(
        Utils.lowerCase(body.email), 
        new ObjectId(body.businessId as string))
        
      if (existingCustomer) {
        throw new BadRequestError('Customer with this email address already exists')
      }
      const customerData = {
        _id: new ObjectId(),
        businessId: new ObjectId(body.businessId as string),
        name: Utils.firstLetterToUpperCase(body.name),
        email: body.email,
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


  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessId = req.currentUser?.businessId

      const customers = await customerService.fetchAll(new ObjectId(businessId))
      const filterdCustomers = customers?.map(customer => omit(customer.toJSON(),
        ['createdAt', 'updatedAt', '__v']))

      const message =  customers?.length ? 'Customer data fetched successfully' : 'No Customer Data found'

      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message,
        data: filterdCustomers || []
      })

    } catch (error) {
      log.error(`Error occurred while fetching customer ${(error as Error).message}`)
      next(error)
    }
  }

  public async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const body = Utils.sanitizeInput(req.body)
  
      // Validate input
      const parsedDataOrError = Utils.schemaParser(editCustomerSchema, body)
      if (parsedDataOrError !== true) {
        log.warn('Validation failed:', parsedDataOrError.toString())
        throw new ZodValidationError(parsedDataOrError.toString())
      }
  
      // Ensure customer exists
      const existingCustomer = await customerService.findById(new ObjectId(id))
      if (!existingCustomer) {
        throw new BadRequestError('Customer not found')
      }
      
      const businessId = req.currentUser?.businessId 
      if (businessId?.toString() !== existingCustomer.businessId.toString()) {
        throw new NotAuthorizedError('User not authorized for this business')
      }
      // Prepare update data
      const updateData: Partial<ICustomerDocument> = {
        name: body.name ? Utils.firstLetterToUpperCase(body.name) : existingCustomer.name,
        email: body.email || existingCustomer.email,
        phone: body.phone || existingCustomer.phone,
        address: body.address || existingCustomer.address,
        customerType: body.customerType || existingCustomer.customerType,
        businessName: body.businessName || existingCustomer.businessName,
        marketingOptIn: body.marketingOptIn ?? existingCustomer.marketingOptIn
      }
  
      // Perform update
      const updatedCustomer = await customerService.updateCustomer(new ObjectId(id), updateData)
      if (!updatedCustomer) {
        throw new BadRequestError('Failed to update customer')
      }
      
      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Customer data updated successfully',
        data: omit(updatedCustomer.toJSON(), ['createdAt', 'updatedAt', '__v'])
      })
  
    } catch (error) {
      log.error(`Error occurred while editing customer: ${(error as Error).message}`)
      next(error)
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      
      // Ensure customer exists
      const existingCustomer = await customerService.findById(new ObjectId(id))
      if (!existingCustomer) {
        throw new BadRequestError('Customer not found')
      }

      const businessId = req.currentUser?.businessId 
      if (businessId?.toString() !== existingCustomer.businessId.toString()) {
        throw new NotAuthorizedError('User not authorized for this business')
      }

      // Delete customer
      await customerService.deleteCustomer(new ObjectId(id))
      
      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Customer deleted successfully'
      })
    } catch (error) {
      log.error(`Error occurred while deleting customer: ${(error as Error).message}`)
      next(error)
    }
  }

  public async fetch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      
      // Ensure customer exists
      const existingCustomer = await customerService.findById(new ObjectId(id))
      if (!existingCustomer) {
        throw new BadRequestError('Customer not found')
      }

      const businessId = req.currentUser?.businessId 
      if (businessId?.toString() !== existingCustomer.businessId.toString()) {
        throw new NotAuthorizedError('User not authorized for this business')
      }
      
      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Customer data fetched successfully',
        data: omit(existingCustomer.toJSON(), ['createdAt', 'updatedAt', '__v']),

      })
    } catch (error) {
      log.error(`Error occurred while fetching customer: ${(error as Error).message}`)
      next(error)
    }    
  }
  
}


export const customer = new Customer()