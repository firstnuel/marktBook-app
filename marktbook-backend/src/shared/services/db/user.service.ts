import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import { UserModel } from '@root/features/users/models/user.schema'


class UserService {
    public async addUserData(data: IuserDocument): Promise<void> {
        await UserModel.create(data)
      }

}


export const userService: UserService = new UserService()