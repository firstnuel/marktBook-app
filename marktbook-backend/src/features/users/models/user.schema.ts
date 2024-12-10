import { model, Model, Schema } from 'mongoose'
import { IuserDocument } from '../interfaces/user.interface'

const userSchema: Schema = new Schema(
    {
      name: { type: String, required: true },
      uId: { type: String, required: false},
      email: {
        type: String,
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'invalid email']
      },
      authId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Auth', 
        index: true, 
        required: true 
      },
      mobileNumber: {
        type: String,
        required: false,
        trim: true,
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
        trim: true,
        unique: true, 
        sparse: true, // Allows multiple null/empty values
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
  userSchema.index({ email: 1 }, { unique: true, sparse: true })
  userSchema.index({ username: 1 })
  userSchema.index({ nin: 1 }, { unique: true, sparse: true })


  userSchema.pre('save', function(next) {
    if (this.nin === '') {
      this.nin = undefined
    }
    next()
  })

  
  export const UserModel: Model<IuserDocument> = model<IuserDocument>('User', userSchema, 'User')
  
