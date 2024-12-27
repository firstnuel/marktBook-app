import { model, Model, Schema } from 'mongoose'
import { ILogDocument, ActionType, EntityType } from '@activity/interfaces/logs.interfaces'

const LogSchema = new Schema<ILogDocument>({
  userId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  businessId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'Business' 
  },
  username: { 
    type: String, 
    required: true 
  },
  action: { 
    type: String, 
    enum: Object.values(ActionType), 
    required: true 
  },
  entity: { 
    type: String, 
    enum: Object.values(EntityType), 
    required: true 
  },
  entityId: { 
    type: Schema.Types.ObjectId, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now
  },
}, { timestamps: true })


const LogModel: Model<ILogDocument> = model<ILogDocument>('Logs', LogSchema, 'Logs')
export { LogModel }