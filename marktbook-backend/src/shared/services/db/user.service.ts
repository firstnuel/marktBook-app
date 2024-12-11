import { IuserDocument } from '@root/features/users/interfaces/user.interface'
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

      public async updateUserLogin(userId: string | ObjectId): Promise<void> {
        await UserModel.updateOne({ _id: userId }, {
          lastLogin: Date.now()
        })
      }

}


export const userService: UserService = new UserService()