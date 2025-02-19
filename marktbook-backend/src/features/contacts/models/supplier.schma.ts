import { ISupplierDocument, PaymentMethod, SuppierType } from '@contacts/interfaces/contacts.interface'
import { model, Schema, Model } from 'mongoose'

const supplierSchema: Schema<ISupplierDocument> = new Schema({
  name: { type: String, required: true },
  businessId: {
    type: Schema.Types.ObjectId, 
    ref: 'Business',
    required: true 
  },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  contactPerson: { type: String },
  supplierType: { type: String, enum: Object.values(SuppierType) },
  companyName: { type: String },
  preferredPaymentMethod: { type: String, enum: Object.values(PaymentMethod) },
},
{
  timestamps: true
})

const SupplierModel: Model<ISupplierDocument> = model<ISupplierDocument>('Supplier', supplierSchema, 'Supplier')
export { SupplierModel }
