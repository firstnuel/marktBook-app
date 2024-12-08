import { model, Model, Schema } from 'mongoose'
import { IuserDocument } from '../interfaces/user.interface'

const userSchema: Schema = new Schema(
    {
      // Basic Identity & Contact Information
      name: { type: String, required: true },
      uId: { type: String, required: false},
      email: { 
        type: String, 
        required: false, 
        unique: true, 
        lowercase: true, 
        trim: true 
      }, 
      mobileNumber: { 
        type: String, 
        required: false, 
        trim: true 
      },
      role: { 
        type: String, 
        enum: ['Owner', 'Manager', 'Staff'], 
        required: true 
      },
      status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        required: true, 
        default: 'active' 
      },
      address: { 
        type: String, 
        required: false, 
        trim: true 
      },
      nin: { 
        type: String, 
        required: false, 
        unique: true, 
        trim: true 
      },
      username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
      },
      
      // Business Association
      associatedBusinessesId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Business', 
        required: true 
      },
      associatedBusinesses: [
        {
          businessId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Business', 
            required: true 
          },
          businessName: { 
            type: String, 
            required: true, 
            trim: true 
          },
          role: { 
            type: String, 
            enum: ['Owner', 'Manager', 'Staff'], 
            required: true 
          },
        }
      ],
      
      // Emergency Contact (Optional)
      emergencyContact: {
        name: { type: String, required: false, trim: true },
        relationship: { type: String, required: false, trim: true },
        contactNumber: { type: String, required: false, trim: true },
      },
      
      // Activity Tracking
      lastLogin: { type: Date },
      
      // User Preferences (Optional)
      notificationPreferences: {
        emailNotifications: { type: Boolean, default: true },
        smsNotifications: { type: Boolean, default: true },
      },
      languagePreference: { 
        type: String, 
        default: 'english', 
        trim: true 
      },
      
      // Verification & Profile (Optional)
      isVerified: { type: Boolean, default: false },
      profilePicture: { 
        type: String, 
        required: false, 
        trim: true 
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  )
  
  // Indexing for efficient queries
  userSchema.index({ email: 1 })
  userSchema.index({ username: 1 })
  userSchema.index({ nin: 1 })
  
  export const UserModel: Model<IuserDocument> = model<IuserDocument>('User', userSchema, 'User')
  