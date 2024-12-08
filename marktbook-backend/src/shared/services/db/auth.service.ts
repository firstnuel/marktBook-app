import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { AuthModel } from '@auth/models/auth.schema'
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
}

export const authService: AuthService = new AuthService()
