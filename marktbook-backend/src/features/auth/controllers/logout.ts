import HTTP_STATUS from 'http-status-codes'
import { Request, Response } from 'express'

class Logout {
        /**
       * Handles siging out a logged in user.
       * @param req Express Request object
       * @param res Express Response object
       * @param next Express NextFunction for error handling
       */
    public async update(req: Request, res: Response): Promise<void> {
        req.session = null
        res.status(HTTP_STATUS.OK).json({ message: 'Logout successful', user: {}, token: '' })
    }
}


export const logout: Logout = new Logout()