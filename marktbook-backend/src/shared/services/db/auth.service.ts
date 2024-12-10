import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { AuthModel } from '@auth/models/auth.schema'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import { UserModel } from '@root/features/users/models/user.schema'
import { Utils } from '@root/shared/globals/helpers/utils'

class AuthService {

  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data)
  }

  public async getBusinessByNameAndEmail(businessName: string, email: string): Promise<IAuthDocument> {
      const query = {
        businessName: Utils.firstLetterToUpperCase(businessName),
        email: Utils.lowerCase(email),
      }
      const user: IAuthDocument  = await AuthModel.findOne(query).exec() as IAuthDocument
      return user
  }

  public async findUser(businessEmail: string, username: string): Promise<IAuthDocument | null> {

      const query = {
        email: Utils.lowerCase(businessEmail),
        username: Utils.firstLetterToUpperCase(username),
      }
      const authUser = await AuthModel.findOne(query).exec() as IAuthDocument
      return authUser || null
  }

  public async getAuthUser(authUser: IAuthDocument, password: string): Promise<IuserDocument | null> {

      const passwordMatch = await authUser.comparePassword(password)
      if (!passwordMatch) {
        return null
      }
      const user = await UserModel.findOne({ authId: authUser.id }).exec()
      return user || null
  }
  
}

export const authService: AuthService = new AuthService()
