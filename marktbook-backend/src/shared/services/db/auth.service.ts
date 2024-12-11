import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { AuthModel } from '@auth/models/auth.schema'
import { IuserDocument } from '@root/features/users/interfaces/user.interface'
import { UserModel } from '@root/features/users/models/user.schema'
import { Utils } from '@root/shared/globals/helpers/utils'
import { ObjectId } from 'mongodb'

class AuthService {

  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data)
  }

  public async updatePasswordToken(authId: string | ObjectId, token: string, tokenExpiration: number): Promise<void> {
    await AuthModel.updateOne({ _id: authId }, {
      passwordResetToken: token,
      passwordResetExpires: tokenExpiration
    })
  } 

  public async getBusinessByNameAndEmail(businessName: string, email: string): Promise<IAuthDocument | null > {
      const query = {
        businessName: Utils.firstLetterToUpperCase(businessName),
        email: Utils.lowerCase(email),
      }
      const user: IAuthDocument  = await AuthModel.findOne(query).exec() as IAuthDocument
      return user || null
  }

  public async getUserByEmailAndUsername(businessEmail: string, username: string): Promise<IAuthDocument | null> {

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

  public async getUserByEmail(email: string): Promise<IAuthDocument | null> {
    const user  =  await AuthModel.findOne({ email: Utils.lowerCase(email) }).exec() as IAuthDocument
    return user || null
  }

  public async getUserByPasswordToken(token: string): Promise<IAuthDocument | null> {
    const user  =  await AuthModel.findOne({
       passwordResetToken: token,
       passwordResetExpires: { $gt: Date.now() }
      }).exec() as IAuthDocument
    return user || null
  }

}

export const authService: AuthService = new AuthService()
