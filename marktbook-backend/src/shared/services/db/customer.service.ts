import { CustomerModel } from '@contacts/models/contacts.schema'
import { ICustomerDocument } from '@contacts/interfaces/contacts.interface'
import { ObjectId } from 'mongodb'


class CustomerService {
  public async addCustomer(data: ICustomerDocument): Promise<ICustomerDocument> {
    const result = await CustomerModel.create(data)
    return result
  }

  public async findByName(name: string, businessId: ObjectId): Promise<ICustomerDocument | null> {
    const result = await CustomerModel.findOne({ name, businessId }).exec()
    return result
  }

}


export const customerService = new CustomerService()