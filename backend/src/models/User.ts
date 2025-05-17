import mongoose, { Schema, model, Document } from 'mongoose';

/**
 * User interface supports multiple authentication methods:
 * - Google OAuth (googleId)
 * - Email/Password (email + passwordHash)
 * - Mobile Number SMS (mobile)
 */
interface IUser extends Document {
  email?: string;
  passwordHash?: string;
  mobile?: string;
  googleId?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      index: true,
    },
    name: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);
