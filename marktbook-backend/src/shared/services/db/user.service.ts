import {  IuserDocument } from '@root/features/users/interfaces/user.interface'
import { UserModel } from '@root/features/users/models/user.schema'
import { ObjectId } from 'mongodb'


class UserService {
  public async addUserData(data: IuserDocument): Promise<void> {
    await UserModel.create(data)
  }

  public async getUserById(userId: string): Promise<IuserDocument | null> {
    const user = await UserModel.findById(userId).exec()
    return user 
  }

  public async getUserByUsernameAndEmail(username: string, email: string): Promise<IuserDocument | null> {
    const user = await UserModel.findOne({ username, email }).exec()
    return user
  }

  public async updateUserLogin(userId: string | ObjectId): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      lastLogin: Date.now()
    })
  }

  public async getAllUsers(businessId: string | ObjectId): Promise<IuserDocument[]> {
    const result = await UserModel.find({ associatedBusinessesId: businessId }) 
      .select(['name', '_id', 'email', 'username', 'status', 'profilePicture', 'role', 'associatedBusinessesId'])
      
    return result
  }

  public async editUser(userId: string, data: Partial<IuserDocument>): Promise<IuserDocument | null> {
    return UserModel.findByIdAndUpdate(userId, data, { new: true }).exec()
  }

  public async deleteUserById(userId: string): Promise<void> {
    await UserModel.findByIdAndDelete(userId).exec()
  }
  
  
  

}


export const userService: UserService = new UserService()