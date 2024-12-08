import { Basecache } from '@service/redis/base.cache'
import Logger from 'bunyan'
import { config } from '@root/config'
import { ServerError } from '@global/helpers/error-handlers'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'

const log: Logger = config.createLogger('userCache')

export class UserCache extends Basecache {
  constructor() {
    super('userCache')
  }

  public async saveUserToCache(
    key: string,
    userId: string,
    createdUser: IuserDocument
  ): Promise<void> {
    const createdAt = new Date()
    const {
      _id,
      name,
      email,
      mobileNumber,
      role,
      status,
      address,
      nin,
      username,
      associatedBusinessesId,
      associatedBusinesses,
      emergencyContact,
      updatedAt,
      lastLogin,
      notificationPreferences,
      languagePreference,
      isVerified,
      profilePicture,
      uId,
    } = createdUser

    const firstList: string[] = [
      '_id', `${_id}`,
      'uId', `${uId}`,
      'name', name || '',
      'email', email || '',
      'mobileNumber', mobileNumber || '',
      'role', JSON.stringify(role || {}),
      'status', status || '',
      'address', address || '',
      'nin', nin || '',
      'username', username || '',
      'associatedBusinessesId', associatedBusinessesId?.toString() || ''
    ]

    const secondList: string[] = [
      'associatedBusinesses', JSON.stringify(associatedBusinesses || []),
      'emergencyContact', JSON.stringify(emergencyContact || {}),
      'notificationPreferences', JSON.stringify(notificationPreferences || {}),
      'languagePreference', languagePreference || '',
      'isVerified', JSON.stringify(isVerified || false),
      'profilePicture', profilePicture || ''
    ]

    const thirdList: string[] = [
      'createdAt', createdAt.toISOString(),
      'updatedAt', updatedAt ? updatedAt.toISOString() : '',
      'lastLogin', lastLogin ? lastLogin.toISOString() : ''
    ]

    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList]
    const ttlInSeconds = 3600

    try {
      if (!this.client.isOpen) {
        await this.client.connect()
      }

      await this.client.ZADD('users', { score: parseInt(userId, 10), value: `${key}` })
      await this.client.HSET(`users:${key}`, dataToSave)
      await this.client.EXPIRE(`users:${key}`, ttlInSeconds)
    } catch (error) {
      log.error(error)
      throw new ServerError('redis server error, try again')
    }
  }
}
