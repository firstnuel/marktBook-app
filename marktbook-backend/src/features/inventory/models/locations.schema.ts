import { ILocationDocument, Status, MovementType, LocationTypes } from '@inventory/interfaces/location.interfaces'
import { model, Schema, Model } from 'mongoose'


const LocationSchema: Schema<ILocationDocument> = new Schema({
  locationName: { type: String, required: true },
  stocks: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Stock'
    }
  ],
  businessId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Business'
  },
  locationType: {
    type: String,
    enum:  Object.values(LocationTypes)
  },
  address: { type: String },
  currentLoad: { type: Number },
  capacity: { type: Number },
  manager:  { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  locationStatus: {
    type: String,
    enum: Object.values(Status)
  },
  stockMovements: {
    type: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        movementType: { type: String, enum: Object.values(MovementType) },
        quantity: { type: Number },
        destination: { type: Schema.Types.ObjectId, ref: 'Location' },
        initiatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        reason: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
},
{
  timestamps: true, 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


// LocationSchema.virtual('calculatedLoad').get(async function () {  
//   // Aggregate the total units available for all stocks in this location
//   const stocks = await StockModel.find({ locationId: this._id }).select('unitsAvailable')
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const currentLoad = stocks.reduce((total: number, stock: any) => total + (stock.unitsAvailable || 0), 0)
  
//   return currentLoad
// })





const LocationModel: Model<ILocationDocument> = model<ILocationDocument>('Location', LocationSchema, 'Location')
export { LocationModel }