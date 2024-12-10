import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import { UserModel } from '@root/features/users/models/user.schema'


class UserService {
    public async addUserData(data: IuserDocument): Promise<void> {
        await UserModel.create(data)
      }

      public async getUserById(userId: string): Promise<IuserDocument | null> {
        const user = await UserModel.findById(userId).exec()
        return user 
      }

}


export const userService: UserService = new UserService()