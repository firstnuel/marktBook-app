import { SupplierModel } from '@contacts/models/supplier.schma'
import { ISupplierDocument } from '@contacts/interfaces/contacts.interface'
import { ObjectId } from 'mongodb'

class SupplierService {
  public async addSupplier(data: ISupplierDocument): Promise<ISupplierDocument> {
    const result = await SupplierModel.create(data)
    return result
  }

  public async findByEmail(email: string, businessId: ObjectId): Promise<ISupplierDocument | null> {
    const result = await SupplierModel.findOne({ email, businessId }).exec()
    return result
  }

  public async fetchAll(businessId: ObjectId): Promise<ISupplierDocument[] | null> {
    const result = await SupplierModel.find({ businessId }).exec()
    return result
  }

  public async findById(supplierId: ObjectId): Promise<ISupplierDocument | null> {
    const result = await SupplierModel.findById(supplierId).exec()
    return result
  }

  public async updateSupplier(supplierId: ObjectId, data: Partial<ISupplierDocument>): Promise<ISupplierDocument | null> {
    const result = await SupplierModel.findByIdAndUpdate(supplierId, data, { new: true }).exec()
    return result
  }

  public async deleteSupplier(supplierId: ObjectId): Promise<void> {
    await SupplierModel.findByIdAndDelete(supplierId)
  }
}

export const supplierService = new SupplierService()
