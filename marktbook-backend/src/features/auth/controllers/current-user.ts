import HTTP_STATUS  from 'http-status-codes'
import { userService } from '@service/db/user.service'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import { Request, Response } from 'express'
import { userCache } from '@service/redis/user.cache'
import { omit } from 'lodash'

class CurrentUser {
  /**
     * Handles reurning current authenticated user
     * @param req Express Request object
     * @param res Express Response object
    */
  public async read(req: Request, res: Response): Promise<void> {
    let isUser = false
    let token = null 
    let user = null 

    const cachedUser: IuserDocument = await userCache.getUserfromCache(`${req.currentUser?.userId}`) as IuserDocument

    const existingUser: IuserDocument = cachedUser? cachedUser 
      : await userService.getUserById(`${req.currentUser?.userId}`) as IuserDocument

    if (existingUser && Object.keys(existingUser).length) {
      isUser = true
      token = req.session?.jwt
      
      // If existingUser is a Mongoose model instance, call toJSON, else just omit
      user = existingUser.toJSON ? omit(existingUser.toJSON(), ['authId', '__v', 'createdAt', 'updatedAt', 'emergencyContact']) 
        : omit(existingUser, ['authId', '__v', 'createdAt', 'updatedAt', 'emergencyContact'])
    }


    res.status(HTTP_STATUS.OK).json({isUser, token, user })
  }
}


export const currentUser: CurrentUser = new CurrentUser()