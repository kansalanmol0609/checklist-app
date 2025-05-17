import mongoose, { Schema, model, Document, Types } from 'mongoose';

interface IRefreshToken extends Document {
  user: Types.ObjectId;
  token: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: { type: String, required: true, unique: true },
    userAgent: { type: String },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

export default model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
