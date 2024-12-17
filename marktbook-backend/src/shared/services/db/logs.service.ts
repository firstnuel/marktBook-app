import { LogModel } from '@activity/models/logs.schema'
import { ILogDocument } from '@activity/interfaces/logs.interfaces'
import { ObjectId } from 'mongodb'


class LogService {
    
  public async createLog(data: ILogDocument): Promise<void> {
    await LogModel.create(data)
  }

  public async fetchByUserId(userId: ObjectId): Promise<ILogDocument | null> {
    const result = await LogModel.findById(userId).exec()
    return result || null 
  }

  public async fetchByUsername(username: string): Promise<ILogDocument | null> {
    const result = await LogModel.findOne({ username }).exec()
    return result || null 
  }

  public async fetchByBusinessId(businessId: ObjectId): Promise<ILogDocument[] | []> {
    const result =  await LogModel.find({ businessId }).exec()
    return result
  }
}

export const logService = new LogService()