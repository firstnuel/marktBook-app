/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotAuthorizedError } from '@global/helpers/error-handlers'
import { logService } from '@service/db/logs.service'
import { userService } from '@service/db/user.service'
import { userCache } from '@service/redis/user.cache'
import { IuserDocument } from '@users/interfaces/user.interface'
import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from 'http-status-codes'
import { config } from '@root/config'


const log = config.createLogger('logsController')

class Logs {

  /**
   * Handles returning all logs for a business 
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */
  public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      // validate user
      const existingUser = await this.validateUser(`${req.currentUser?.userId}`)

      const logs = await logService.fetchByBusinessId(new ObjectId(`${existingUser.associatedBusinessesId}`))

      const message = logs.length? 'Logs data fetched successfully' : 'No logs found'
      res.status(HTTP_STATUS.OK).json({ message, data: logs })

    }catch (error: any) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching uses')
      next(error)
    }  
  }

  /**
     * Protected method to validate user role and status
     * @param userId string
     * @returns IuserDocument
     */

  protected async validateUser(userId: string): Promise<IuserDocument> {
    const cachedUser = await userCache.getUserfromCache(userId) as IuserDocument
    const existingUser = cachedUser? cachedUser  : await userService.getUserById(userId) as IuserDocument

    if(existingUser?.status !== 'active' || !( existingUser?.role === 'Owner' || existingUser?.role === 'Manager')) {
      throw new NotAuthorizedError('Invalid User: Not authorized for user role') 
    }

    return existingUser
  }
}


export const logs: Logs = new Logs()