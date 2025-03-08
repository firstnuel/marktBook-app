import { CustomerModel } from '@contacts/models/customer.schema'
import { ICustomerDocument } from '@contacts/interfaces/contacts.interface'
import { ObjectId } from 'mongodb'


class CustomerService {
  public async addCustomer(data: ICustomerDocument): Promise<ICustomerDocument> {
    const result = await CustomerModel.create(data)
    return result
  }

  public async findByEmail(email: string, businessId: ObjectId): Promise<ICustomerDocument | null> {
    const result = await CustomerModel.findOne({ email, businessId }).exec()
    return result
  }

  public async fetchAll(businessId: ObjectId): Promise<ICustomerDocument[] | null> {
    const result = await CustomerModel.find({ businessId }).exec()
    return result
  }

  public async findById(customerId: ObjectId): Promise<ICustomerDocument | null> {
    const result = await CustomerModel.findById(customerId).exec()
    return result
  }

  public async updateCustomer(customerId: ObjectId, data:  Partial<ICustomerDocument>): Promise<ICustomerDocument | null> {
    const result = await CustomerModel.findByIdAndUpdate(customerId, data, { new: true } )
    return result
  }

  public async deleteCustomer(customerId: ObjectId): Promise<void> {
    await CustomerModel.findByIdAndDelete(customerId)
  }
  
}


export const customerService = new CustomerService()