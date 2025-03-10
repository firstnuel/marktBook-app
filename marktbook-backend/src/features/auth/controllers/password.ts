import { Request, Response, NextFunction } from 'express'
import { emailSchema, passwordSchema } from '@auth/schemes/authValidation'
import { config } from '@root/config'
import HTTP_STATUS from 'http-status-codes'
import { authService } from '@service/db/auth.service'
import { ZodValidationError, BadRequestError } from '@global/helpers/error-handlers'
import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { Utils } from '@global/helpers/utils'
import crypto from 'crypto'
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template'
import publicIP from 'ip'
import moment from 'moment'
import { IResetPasswordParams, resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template'
import { mailTransport } from '@service/emails/mail.transport'


const log = config.createLogger('password')

class Password {
  constructor( ) {
    this.create = this.create.bind(this)
  }
    
  /**
   * Handles pasword reset.
   * @param req Express Request object
   * @param res Express Response object
   * @param next Express NextFunction for error handling
   */

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    // parse data
    const parsedDataOrError = Utils.schemaParser(emailSchema, req.body)
    if (parsedDataOrError !== true) {
      log.warn('Validation failed:', parsedDataOrError.toString())
      return next(new ZodValidationError(parsedDataOrError.toString()))
    }
    // sanitize input
    const body = Utils.sanitizeInput(req.body)
    const { email } = body

    // User Verification
    const existingUser: IAuthDocument | null = await authService.getUserByEmail(email)
    if(!existingUser) {
      log.warn('user not found')
      return next(new BadRequestError('invalid email, user not found'))
    }

    // generate random characters for password token
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20))
    const randomChars: string = randomBytes.toString('hex')
    await authService.updatePasswordToken(existingUser._id, randomChars, Date.now() + 3600000) // adds 1 hr to current date

    // send password reset link to client email
    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomChars}`
    const template = forgotPasswordTemplate.passwordResetTemplate(existingUser.username, resetLink)

    await mailTransport.sendEmail(email, 'Reset your password', template)

    res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent'})
  }

  /**
       * Handles pasword update.
       * @param req Express Request object
       * @param res Express Response object
       * @param next Express NextFunction for error handling
       */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    // parse data
    const parsedDataOrError = Utils.schemaParser(passwordSchema, req.body)
    if (parsedDataOrError !== true) {
      log.warn('Validation failed:', parsedDataOrError.toString())
      return next(new ZodValidationError(parsedDataOrError.toString()))
    }
    // sanitize input
    const body = Utils.sanitizeInput(req.body)
    const { token } = req.params
    const sToken = Utils.sanitizeInput(token)

    const { password } = body

    // User Verification
    const existingUser: IAuthDocument | null = await authService.getUserByPasswordToken(sToken)
    if(!existingUser) {
      log.warn('user not found')
      return next(new BadRequestError('Reset token is expired'))
    }

    // save new password
    existingUser.resetPassword(password)
    await existingUser.save()

    const templateParams: IResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYYY HH:mm')
    }

    // send confimation email
    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams)
    await mailTransport.sendEmail(existingUser.email, 'Password reset confirmation', template)

    res.status(HTTP_STATUS.OK).json({ message: 'Password updated successfully'})

  }
}



export const password: Password = new Password()

