import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name:      string
  email:     string
  password:  string
  avatar?:   string
  createdAt: Date
  updatedAt: Date
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true, maxlength: 100 },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar:   { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

// Don't expose password in JSON responses
userSchema.set('toJSON', {
  transform: (_, ret) => {
    delete (ret as unknown as Record<string, unknown>).password
    return ret
  },
})

export const User = model<IUser>('User', userSchema)
