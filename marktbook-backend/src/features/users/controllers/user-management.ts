/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { Users } from './users'
import { userService } from '@service/db/user.service'
import HTTP_STATUS from 'http-status-codes'
import { config } from '@root/config'
import { Utils } from '@global/helpers/utils'
import { editUserSchema } from '@users/schemes/userValidation'
import { ADMIN_UPDATE_FIELDS, filterAllowedFields, IuserDocument, USER_UPDATE_FIELDS } from '@users/interfaces/user.interface'
import {  NotAuthorizedError, NotFoundError } from '@global/helpers/error-handlers'
import {  singleImageUpload } from '@global/helpers/cloudinary-upload'
import { createActivityLog, ActionType, EntityType } from '@activity/interfaces/logs.interfaces'
import { logService } from '@service/db/logs.service'
import { authService } from '@service/db/auth.service'

const log  = config.createLogger('userController')

class UserManagement extends Users {
  constructor(){
    super()
    this.getUser = this.getUser.bind(this)
    this.editUser = this.editUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
  }
  /**
   * Handles fetching User by Id     
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */
  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract Id
      const { id } = req.params

      // Validate the requesting user
      await this.checkUser(`${req.currentUser?.userId}`)

      const fetchedUser = await userService.getUserById(id)

      if (fetchedUser) {
        res.status(HTTP_STATUS.OK).json({ status: 'success',
          message: 'User fetched successfully',
          data: fetchedUser,
        })
      } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          status: 'error',
          message: 'User not found',
        })
      }
    } catch (error: any) {
      // Log and forward the error to a centralized error handler
      log.error(`Error fetching user by ID: ${error.message}`)
      next(error)
    }
  }

  /**
   * Handles editing user based on status and role
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */

  public async editUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      this.validateInput(editUserSchema, req.body)
  
      // Extract and sanitize the input data
      const body = Utils.sanitizeInput(req.body)

      let filteredData: Partial<IuserDocument>
      
      const userId = req.currentUser?.userId
      if (!userId) {
        throw new NotAuthorizedError('Invalid User: Not authorized for user role')
      }
      const user = await this.checkUser(userId)

      if (user.role === 'Manager' || user.role === 'Owner') {
        filteredData = filterAllowedFields(body, ADMIN_UPDATE_FIELDS)
      }
      filteredData = filterAllowedFields(body, USER_UPDATE_FIELDS)

      // Extract user ID
      const { id } = req.params
  
      // Check if user exists
      const existingUser = await this.checkUser(id)
      if (!existingUser) {
        throw new NotFoundError('User not found')
      } 

      // Upload profille picture if provided
      if (filteredData.profilePicture){ 
        filteredData.profilePicture = await singleImageUpload(filteredData.profilePicture, id)
      }
  
      filteredData.updatedAt = new Date()
  
      // Perform update
      const updatedUser = await userService.editUser(id, filteredData)

      // log user activity
      const logData = createActivityLog (
        user._id, 
        user.username, 
        user.associatedBusinessesId, 
        'EDIT' as ActionType, 
        'USER' as EntityType,
        `${id}`,
        `Edited user '${existingUser.username}'`)
      
      await logService.createLog(logData)
  
      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'User updated successfully',
        data: updatedUser,
      })
    } catch (error: any) {
      log.error(`Error updating user: ${error.message}`)
      next(error)
    }
  }

  /**
   * Handles deleting a user
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */
  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract ID
      const { id } = req.params

      const admin = await this.checkUser(`${req.currentUser?.userId}`)

      // Check if user exists
      const existingUser = await userService.getUserById(id)
      if (!existingUser) {
        return next(new NotFoundError('User not found'))
      }

      // delete user and auth credentials
      await authService.deleteAuth(existingUser.authId as string)
      await userService.deleteUserById(id)

      // log user activity
      const logData = createActivityLog (
        admin._id, 
        admin.username, 
        admin.associatedBusinessesId, 
        'DELETE' as ActionType, 
        'USER' as EntityType,
        `${id}`,
        `Deleted user '${existingUser.username}'`)
            
      await logService.createLog(logData)

      // Respond to client
      res.status(HTTP_STATUS.OK).json({
        status: 'success',
        message: 'User deleted successfully',
      })
    } catch (error: any) {
      log.error(`Error deleting user: ${error.message}`)
      next(error)
    }
  }


}

export const userManagement: UserManagement = new UserManagement()
