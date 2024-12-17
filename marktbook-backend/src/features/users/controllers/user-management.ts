/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { Users } from './users'
import { userService } from '@service/db/user.service'
import HTTP_STATUS from 'http-status-codes'
import { config } from '@root/config'
import { Utils } from '@global/helpers/utils'
import { editUserSchema } from '@users/schemes/userValidation'
import { filterAllowedFields } from '@users/interfaces/user.interface'
import { NotFoundError } from '@global/helpers/error-handlers'

const log  = config.createLogger('userController')

class UserManagement extends Users {
  /**
   * Handles fetching User by Id     
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */
  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract and sanitize Id
      const { id } = req.params
      const userId = Utils.sanitizeInput(id)

      // Validate the requesting user
      await this.validateUser(`${req.currentUser?.userId}`)

      const fetchedUser = await userService.getUserById(userId)

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
      const filteredData = filterAllowedFields(body)
  
      filteredData.updatedAt = new Date()
  
      // sanitize user ID
      const { id } = req.params
      const userId = Utils.sanitizeInput(id)
  
      // Validate requesting user
      await this.validateUser(`${req.currentUser?.userId}`)
  
      // Check if user exists
      const existingUser = await userService.getUserById(userId)
      if (!existingUser) {
        return next(new NotFoundError('User not found'))
      }
  
      // Perform update
      const updatedUser = await userService.editUser(userId, filteredData)
  
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
      // Extract and sanitize user ID
      const { id } = req.params
      const userId = Utils.sanitizeInput(id)

      // Validate the requesting user
      await this.validateUser(`${req.currentUser?.userId}`)

      // Check if user exists
      const existingUser = await userService.getUserById(userId)
      if (!existingUser) {
        return next(new NotFoundError('User not found'))
      }

      // Perform deletion
      await userService.deleteUserById(userId)

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
