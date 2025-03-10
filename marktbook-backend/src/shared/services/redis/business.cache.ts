import { IBusinessDocument } from '@business/interfaces/business.interface'
import { Basecache } from '@service/redis/base.cache'
import Logger from 'bunyan'
import { config } from '@root/config'
import { ServerError } from '@global/helpers/error-handlers'

const log: Logger = config.createLogger('businessCache')

class BusinessCache extends Basecache {
  constructor() {
    super('businessCache')
  }

  public async saveBusinessToCache(
    key: string,
    businessId: string,
    createdBusiness: IBusinessDocument
  ): Promise<void> {
    const createdAt = new Date()
    const {
      _id,
      verifiedStatus,
      verifyData,
      businessName,
      email,
      admins,
      businessLogo,
      currency,
      uId,
      businessCategory,
      businessAddress,
      businessType,
      businessAccount,
      phoneNumber,
      notifications,
    } = createdBusiness
      
    const firstList: string[] = [
      '_id', `${_id}`,
      'businessName', businessName || '',
      'email', email || '',
      'uId', uId || '',
      'currency', currency || 'USD', 
    ]
      
    const secondList: string[] = [
      'verifiedStatus', JSON.stringify(verifiedStatus || false),
      'verifyData', JSON.stringify(verifyData || {}),
      'businessCategory', JSON.stringify(businessCategory || ''),
      'businessAddress', businessAddress || '',
      'businessType', JSON.stringify(businessType || ''),
      'businessAccount', JSON.stringify(businessAccount || {}),
      'phoneNumber', phoneNumber || '',
    ]
      
    const thirdList: string[] = [
      'admins', JSON.stringify(admins || []),
      'businessLogo', businessLogo || '',
      'notifications', JSON.stringify(notifications || {}),
      'createdAt', createdAt.toISOString(),
    ]
        
    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList]
    const ttlInSeconds = 3600
    try{
      if (!this.client.isOpen) {
        await this.client.connect()
      }
      await this.client.ZADD('business', { score: parseInt(businessId, 10), value: `${key}`})
      await this.client.HSET(`business:${key}`, dataToSave)

      await this.client.EXPIRE(`business:${key}`, ttlInSeconds)
            
    } catch (error){
      log.error(error)
      throw new ServerError('redis server error, try again')
    }

  }
      
  public async getBusinessFromCache(key: string): Promise<IBusinessDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect()
      }
    
      const cacheData = await this.client.HGETALL(`business:${key}`)
            
      if (Object.keys(cacheData).length === 0) {
        return null // No data found for the given key
      }
    
      // Parse the retrieved data to reconstruct the IBusinessDocument object
      const businessData = {
        _id: cacheData['_id'],
        businessName: cacheData['businessName'] || undefined,
        email: cacheData['email'] || undefined,
        uId: cacheData['uId'] || undefined,
        verifiedStatus: JSON.parse(cacheData['verifiedStatus']),
        verifyData: JSON.parse(cacheData['verifyData']),
        businessCategory: JSON.parse(cacheData['businessCategory']),
        businessAddress: cacheData['businessAddress'] || undefined,
        businessType: JSON.parse(cacheData['businessType']),
        businessAccount: JSON.parse(cacheData['businessAccount']),
        phoneNumber: cacheData['phoneNumber'] || undefined,
        admins: JSON.parse(cacheData['admins']),
        businessLogo: cacheData['businessLogo'] || undefined,
        notifications: JSON.parse(cacheData['notifications']),
        createdAt: new Date(cacheData['createdAt']),
      } as IBusinessDocument
    
      return businessData
    } catch (error) {
      log.error(error)
      throw new ServerError('Error retrieving business data from cache, try again')
    }
  }
}


export const businessCache: BusinessCache = new BusinessCache()