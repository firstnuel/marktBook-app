import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { AuthModel } from '@auth/models/auth.schema'
import { Utils } from '@root/shared/globals/helpers/utils'

class AuthService {

  public async getUserByUsernameAndBusinessEmail(username: string, email: string): Promise<IAuthDocument> {
      const query = {
        username: Utils.firstLetterToUpperCase(username),
        email: Utils.lowerCase(email),
      }
      const user: IAuthDocument  = await AuthModel.findOne(query).exec() as IAuthDocument
      return user
  }
}

export const authService: AuthService = new AuthService()
