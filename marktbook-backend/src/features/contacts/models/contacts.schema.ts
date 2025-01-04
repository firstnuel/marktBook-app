import { ICustomerDocument } from '@contacts/interfaces/contacts.interface'
import { model, Schema, Model } from 'mongoose'


const customerSchema: Schema<ICustomerDocument> = new Schema({
  name: { type: String, required: true },
  businessId: {
    type: Schema.Types.ObjectId, 
    ref: 'Business',
    required: true 
  },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  customerType: { type: String, enum: ['Individual', 'Business']},
  businessName:{ type: String },
  marketingOptIn: { type: Boolean, default: false },
},
{
  timestamps: true
}
)

const CustomerModel: Model<ICustomerDocument> = model<ICustomerDocument>('Customer', customerSchema, 'Customer')
export { CustomerModel }