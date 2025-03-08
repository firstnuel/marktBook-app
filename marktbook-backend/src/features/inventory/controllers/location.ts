/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILocationDocument, ILocationData, Status, filterLocationFields, EditableFields } from '@inventory/interfaces/location.interfaces'
import { Stock } from '@inventory/controllers/stocks'
import { Request, Response, NextFunction } from 'express'
import { editLocationSchema, locationSchema } from '@inventory/schemes/locationValidation'
import { config } from '@root/config'
import { Utils } from '@global/helpers/utils'
import HTTP_STATUS from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { locationService } from '@service/db/location.service'
import { ActionType, createActivityLog, EntityType } from '@activity/interfaces/logs.interfaces'
import { logService } from '@service/db/logs.service'
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handlers'
import { omit } from 'lodash'

const log = config.createLogger('locationController')

class Location extends Stock {
  constructor(){
    super()
    this.create = this.create.bind(this)
    this.read = this.read.bind(this)
    this.edit = this.edit.bind(this)
    this.delete = this.delete.bind(this)
  }

  /**
  * Handles the creating of a new Location.
  * @param req Express Request object
  * @param res Express Response object
  * @param next Express NextFunction for error handling
  */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      this.validateInput(locationSchema, req.body)
      const user = req.user!
      const body: ILocationData = Utils.sanitizeInput(req.body)

      // check if Location exist
      const existingLocation = 
      await locationService.findByName(Utils.firstLetterToUpperCase(body.locationName), new ObjectId(body.businessId))
      if(existingLocation) return next(new BadRequestError('Location already exist with this name'))

      const data = {
        _id: new ObjectId(),
        stocks: [],
        businessId: new ObjectId(body.businessId),
        locationName: Utils.firstLetterToUpperCase(body.locationName),
        locationType: body.locationType,
        address:  body.address,
        currentLoad: body.currentLoad,
        capacity: body.capacity,
        manager: body.manager ? new ObjectId(body.manager) : new ObjectId(user._id),
        locationStatus: body.locationStatus as Status,
        stockMovements: []
      } as unknown as ILocationDocument

      // save data
      const location = await locationService.addLocation(data)
      const transformedLocation  = this.transformLocation([location])

      // Log the activity
      const logData = createActivityLog (
        user._id, 
        user.username, 
        user.associatedBusinessesId, 
        'CREATE' as ActionType, 
        'LOCATION' as EntityType,
        `${data._id}`,
        `Created location '${data?.locationName}'`)
      
      await logService.createLog(logData)

      // response to client
      res.status(HTTP_STATUS.CREATED).json({
        message: `Created new location '${data.locationName}' successfully`,
        data: transformedLocation[0],
        status: 'success'
      })

    } catch(error) {
      next(error)
      log.error('Error creating new Location')
    }
  }

  /**
  * Handles the fetching all location associated to a business.
  * @param req Express Request object
  * @param res Express Response object
  * @param next Express NextFunction for error handling
  */
  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const user = req.user!
      const locationData = await locationService.fetchAll(new ObjectId(user.associatedBusinessesId))

      const returnData = this.transformLocation(locationData)
      const message = locationData.length? 'All Location data fetched successfully' : 'No Location data found'
      res.status(HTTP_STATUS.OK).json({ message, data: returnData })

    } catch(error) {
      next(error)
      log.error('Error fetchong Location data')
    }
  }

  /**
  * Handles the fetching a location by Id
  * @param req Express Request object
  * @param res Express Response object
  * @param next Express NextFunction for error handling
  */
  public async fetch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const user = req.user!

      const { id } = req.params 

      // check if location exist
      const location = await locationService.getById(new ObjectId(id))
      if (!location) {
        return next(new NotFoundError('Location not found'))
      }

      if (user.associatedBusinessesId.toString() !== location.businessId.toString()) {
        return next(new NotAuthorizedError('Not Authorized: User not fetch location data'))
      }

      const locationData = omit(location.toObject(),  ['__v', 'businessId', '_id'])

      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Location data fetched successfully',
        data: locationData,
      })

    } catch(error) {
      next(error)
      log.error('Error fetchong Location data')
    }
  }


  /**
   * Handles editing a location data
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */

  public async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // validate input
      this.validateInput(editLocationSchema, req.body)
        
      const { id } = req.params 
      const user = req.user!

      // check if location exist
      const location = await locationService.getById(new ObjectId(id))
      if (!location) {
        return next(new NotFoundError('Location not found'))
      }

      // sanitize the input data
      const body = Utils.sanitizeInput(req.body)
      const filteredData = filterLocationFields(body, EditableFields) 

      if (filteredData.locationName) filteredData.locationName = Utils.firstLetterToUpperCase(filteredData.locationName)
      // perform update
      const updatedData = await locationService.editLocation(new ObjectId(location._id), filteredData)
      const transformedLocation  = this.transformLocation([updatedData])[0]

      // log update
      const logData = createActivityLog (
        user._id, 
        user.username, 
        user.associatedBusinessesId, 
        'EDIT' as ActionType, 
        'LOCATION' as EntityType,
        `${updatedData?._id}`,
        `Edited location data for '${updatedData?.locationName}'`)

      await logService.createLog(logData)

      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'Location data updated successfully',
        data: transformedLocation,
      })

    } catch (error) {
      log.error('Error updating location data')
      next(error)
    }
  }


  /**
  * Handles deleting a location by Id
  * @param req Express Request object
  * @param res Express Response object
  * @param next Express NextFunction for error handling
  */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!
      const { id } = req.params 

      // check if location exists
      const location = await locationService.getById(new ObjectId(id))
      if (!location) {
        return next(new NotFoundError('Location not found'))
      }

      if (user.associatedBusinessesId.toString() !== location.businessId.toString()) {
        return next(new NotAuthorizedError('Not Authorized: User cannot delete this location'))
      }

      // delete location
      await locationService.delLocation(new ObjectId(id))

      // log delete action
      const logData = createActivityLog (
        user._id, 
        user.username, 
        user.associatedBusinessesId, 
        'DELETE' as ActionType, 
        'LOCATION' as EntityType,
        `${id}`,
        `Deleted location '${location.locationName}'`)
      
      await logService.createLog(logData)

      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: `Location '${location.locationName}' deleted successfully`,
      })

    } catch(error) {
      log.error('Error deleting location')
      next(error)
    }
  }


  private transformLocation(locations: any[]): any[] {
    if (!locations) return []
  
    return locations.map(location => {
      const locationData = location.toJSON()
  
      if (locationData.stocks) {
        locationData.stocksLength = locationData.stocks.length
        delete locationData.stocks
      } else {
        locationData.stocksLength = 0
        delete locationData.stocks
      }
  
      if (locationData.manager) {
        locationData.manager = locationData.manager.name
      } else {
        locationData.manager  = null
      }
  
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
      }
  
      return omit(locationData, ['createdBy', 'createdAt', '__v', 'businessId', '_id'])
    })
  }
}


export const location: Location = new Location()