import { hash, compare } from 'bcryptjs'
import { IAuthDocument } from '@auth/interfaces/auth.interface'
import { model, Model, Schema } from 'mongoose'

const SALT_ROUND = 10

const authSchema: Schema = new Schema(
    {
      username: { type: String },
      businessName:  { type: String },
      uId: { type: String },
      businessId: { type: String },
      email: { type: String },
      password: { type: String },
      createdAt: { type: Date, default: Date.now },
      passwordResetToken: { type: String, default: '' },
      passwordResetExpires: { type: Number }
    },
    {
      toJSON: {
        transform(_doc, ret) {
          delete ret.password
          return ret
        }
      },
      timestamps: true
    }
  )
  
  authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
    if (this.isModified('password')) {
      const hashedPassword: string = await hash(this.password as string, SALT_ROUND)
      this.password = hashedPassword
    }
    next()
  })
  
  authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const hashedPassword: string = (this as unknown as IAuthDocument).password!
    return compare(password, hashedPassword)
  }
  
  authSchema.methods.hashPassword = async function (password: string): Promise<string> {
    return hash(password, SALT_ROUND)
  }

  authSchema.methods.resetPassword = function (password: string): void {
    this.password = password
    this.passwordResetToken = undefined
    this.passwordResetExpires = undefined
  }


  
  const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth')
  export { AuthModel }