import { Request, Response, NextFunction } from 'express'
import { password } from '@auth/controllers/password'
import { authService } from '@service/db/auth.service'
import { emailQueue } from '@service/queues/email.queue'
import { Utils } from '@global/helpers/utils'
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template'
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template'
import { authMockRequest, authMockResponse } from '@root/mocks/auth.mock'
import { IAuthDocument } from '@auth/interfaces/auth.interface'
import HTTP_STATUS from 'http-status-codes'
import crypto from 'crypto'
import moment from 'moment'
import { ZodValidationError, BadRequestError } from '@global/helpers/error-handlers'

jest.mock('@service/db/auth.service', () => ({
  authService: {
    getUserByEmail: jest.fn(),
    updatePasswordToken: jest.fn(),
    getUserByPasswordToken: jest.fn(),
  },
}))

jest.mock('@service/queues/email.queue', () => ({
  emailQueue: {
    addEmailJob: jest.fn(),
  },
}))

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => Buffer.from('mockedRandomBytes')),
}))

jest.mock('ip', () => ({
  address: jest.fn(() => '127.0.0.1'),
}))

describe('Password Controller', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    req = authMockRequest({}, { email: 'user@example.com', password: 'NewPassword123!' }) as Request
    res = authMockResponse()
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('create (password reset)', () => {
    it('should throw validation error if email is invalid', async () => {
      jest.spyOn(Utils, 'schemaParser').mockReturnValue('Invalid email')

      await password.create(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(ZodValidationError))
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid email' }))
    })

    it('should return error if user is not found', async () => {
      jest.spyOn(Utils, 'schemaParser').mockReturnValue(true);
      (authService.getUserByEmail as jest.Mock).mockResolvedValue(null)

      await password.create(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'invalid email, user not found' })
      )
    })

    it('should send a password reset email', async () => {
      jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
      const mockUser: IAuthDocument = {
        _id: '12345',
        username: 'testuser',
        email: 'user@example.com',
      } as IAuthDocument
      
      // Mock randomBytes to return the exact string 'mockedRandomBytes'
      jest.spyOn(crypto, 'randomBytes').mockImplementation(() => {
        const buffer = Buffer.from('mockedRandomBytes')
        // Override the toString method to return the exact string
        buffer.toString = () => 'mockedRandomBytes'
        return buffer
      });
      
      (authService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser)
      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=mockedRandomBytes`
      const template = forgotPasswordTemplate.passwordResetTemplate('testuser', resetLink)
      
      await password.create(req, res, next)
      
      expect(authService.updatePasswordToken).toHaveBeenCalledWith(
        '12345',
        'mockedRandomBytes',
        expect.any(Number)
      )
      expect(emailQueue.addEmailJob).toHaveBeenCalledWith('forgotPasswordEmail', {
        template,
        receiveEmail: 'user@example.com',
        subject: 'Reset your password',
      })
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset email sent' })
    })
  })

  describe('update (password update)', () => {
    it('should throw validation error if password is invalid', async () => {
      jest.spyOn(Utils, 'schemaParser').mockReturnValue('Invalid password')

      req.body = { password: 'short' } // Invalid password
      await password.update(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(ZodValidationError))
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid password' }))
    })

    it('should return error if reset token is expired', async () => {
      jest.spyOn(Utils, 'schemaParser').mockReturnValue(true);
      (authService.getUserByPasswordToken as jest.Mock).mockResolvedValue(null)

      req.params = { token: 'mockedToken' }
      await password.update(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError))
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Reset token is expired' })
      )
    })

    it('should update the password and send a confirmation email', async () => {
      jest.spyOn(Utils, 'schemaParser').mockReturnValue(true)
      const mockUser: IAuthDocument = {
        _id: '12345',
        username: 'testuser',
        email: 'user@example.com',
        resetPassword: jest.fn(),
        save: jest.fn(),
      } as unknown as IAuthDocument;

      (authService.getUserByPasswordToken as jest.Mock).mockResolvedValue(mockUser)

      req.params = { token: 'mockedToken' }
      req.body = { password: 'NewPassword123!' }

      const templateParams = {
        username: 'testuser',
        email: 'user@example.com',
        ipaddress: '127.0.0.1',
        date: moment().format('DD/MM/YYYY HH:mm'),
      }
      const template = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams)

      await password.update(req, res, next)

      expect(mockUser.resetPassword).toHaveBeenCalledWith('NewPassword123!')
      expect(mockUser.save).toHaveBeenCalled()
      expect(emailQueue.addEmailJob).toHaveBeenCalledWith('forgotPasswordEmail', {
        template,
        receiveEmail: 'user@example.com',
        subject: 'Password reset confirmation',
      })
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' })
    })
  })
})
