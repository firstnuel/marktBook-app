import HTTP_STATUS from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'
import { supplierSchema, editSupplierSchema } from '@contacts/schemes/contactsValidations'
import { config } from '@root/config'
import { Utils } from '@global/helpers/utils'
import { BadRequestError, NotAuthorizedError, ZodValidationError } from '@global/helpers/error-handlers'
import { ObjectId } from 'mongodb'
import { ISupplierDocument } from '@contacts/interfaces/contacts.interface'
import { supplierService } from '@service/db/supplier.service'
import { omit } from 'lodash'

const log = config.createLogger('supplierController')

class Supplier {
  /**
   * Handle creating a new supplier
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = Utils.sanitizeInput(req.body)

      const parsedDataOrError = Utils.schemaParser(supplierSchema, body)
      if (parsedDataOrError !== true) {
        log.warn('Validation failed:', parsedDataOrError.toString())
        throw new ZodValidationError(parsedDataOrError.toString())
      }

      const existingSupplier = await supplierService.findByEmail(
        Utils.lowerCase(body.email), 
        new ObjectId(body.businessId as string)
      )
        
      if (existingSupplier) {
        throw new BadRequestError('Supplier with this email address already exists')
      }

      const supplierData = {
        _id: new ObjectId(),
        businessId: new ObjectId(body.businessId as string),
        name: Utils.firstLetterToUpperCase(body.name),
        email: body.email,
        contactPerson: body.contactPerson,
        phone: body.phone || undefined, 
        address: body.address || undefined, 
        supplierType: body.supplierType,
        companyName: body.companyName || undefined, 
        preferredPaymentMethod: body.preferredPaymentMethod || undefined

      } as ISupplierDocument

      const newSupplier = await supplierService.addSupplier(supplierData)

      res.status(HTTP_STATUS.CREATED).json({
        status: 'success',
        message: 'Supplier data created successfully',
        data: omit(newSupplier.toObject(), ['createdAt', 'updatedAt', '__v'])
      })

    } catch (error) {
      log.error(`Error occurred while creating supplier ${(error as Error).message}`)
      next(error)
    }
  }

  /**
   * Fetch all suppliers
   */
  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessId = req.currentUser?.businessId

      const suppliers = await supplierService.fetchAll(new ObjectId(businessId))
      const filteredSuppliers = suppliers?.map(supplier => omit(supplier.toJSON(),
        ['createdAt', 'updatedAt', '__v']))

      const message = suppliers?.length ? 'Supplier data fetched successfully' : 'No Supplier Data found'

      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message,
        data: filteredSuppliers || []
      })

    } catch (error) {
      log.error(`Error occurred while fetching suppliers ${(error as Error).message}`)
      next(error)
    }
  }

  /**
   * Edit supplier details
   */
  public async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const body = Utils.sanitizeInput(req.body)
  
      const parsedDataOrError = Utils.schemaParser(editSupplierSchema, body)
      if (parsedDataOrError !== true) {
        log.warn('Validation failed:', parsedDataOrError.toString())
        throw new ZodValidationError(parsedDataOrError.toString())
      }
  
      const existingSupplier = await supplierService.findById(new ObjectId(id))
      if (!existingSupplier) {
        throw new BadRequestError('Supplier not found')
      }
      
      const businessId = req.currentUser?.businessId 
      if (businessId?.toString() !== existingSupplier.businessId.toString()) {
        throw new NotAuthorizedError('User not authorized for this business')
      }

      const updateData: Partial<ISupplierDocument> = {
        name: body.name ? Utils.firstLetterToUpperCase(body.name) : existingSupplier.name,
        email: body.email || existingSupplier.email,
        phone: body.phone || existingSupplier.phone,
        address: body.address || existingSupplier.address,
        supplierType: body.supplierType || existingSupplier.supplierType,
        companyName: body.companyName || existingSupplier.companyName,
        contactPerson: body.contactPerson || existingSupplier.contactPerson,
        preferredPaymentMethod: body.preferredPaymentMethod || existingSupplier.preferredPaymentMethod
      }
  
      const updatedSupplier = await supplierService.updateSupplier(new ObjectId(id), updateData)
      if (!updatedSupplier) {
        throw new BadRequestError('Failed to update supplier')
      }
      
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Supplier data updated successfully',
        data: omit(updatedSupplier.toJSON(), ['createdAt', 'updatedAt', '__v'])
      })
  
    } catch (error) {
      log.error(`Error occurred while editing supplier: ${(error as Error).message}`)
      next(error)
    }
  }

  /**
   * Delete supplier
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      
      const existingSupplier = await supplierService.findById(new ObjectId(id))
      if (!existingSupplier) {
        throw new BadRequestError('Supplier not found')
      }
      
      const businessId = req.currentUser?.businessId 
      if (businessId?.toString() !== existingSupplier.businessId.toString()) {
        throw new NotAuthorizedError('User not authorized for this business')
      }

      await supplierService.deleteSupplier(new ObjectId(id))
      
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Supplier deleted successfully'
      })
    } catch (error) {
      log.error(`Error occurred while deleting supplier: ${(error as Error).message}`)
      next(error)
    }
  }

  public async fetch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      
      // Ensure supplier exists
      const existingSupplier = await supplierService.findById(new ObjectId(id))
      if (!existingSupplier) {
        throw new BadRequestError('Supplier not found')
      }

      const businessId = req.currentUser?.businessId 
      if (businessId?.toString() !== existingSupplier.businessId.toString()) {
        throw new NotAuthorizedError('User not authorized for this business')
      }
      
      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Supplier data fetched successfully',
        data: omit(existingSupplier.toJSON(), ['createdAt', 'updatedAt', '__v']),
      })
    } catch (error) {
      log.error(`Error occurred while fetching supplier: ${(error as Error).message}`)
      next(error)
    }    
  }
}

export const supplier = new Supplier()
