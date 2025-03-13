/* eslint-disable @typescript-eslint/no-explicit-any */
import { logService } from '@service/db/logs.service'
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
      const existingUser = req.user!

      const logs = await logService.fetchByBusinessId(new ObjectId(`${existingUser.associatedBusinessesId}`))

      const message = logs.length? 'Logs data fetched successfully' : 'No logs found'
      res.status(HTTP_STATUS.OK).json({ message, data: logs })

    }catch (error: any) {
      // Log and forward the error to a centralized error handler
      log.error('Error fetching uses')
      next(error)
    }  
  }
}


export const logs: Logs = new Logs()