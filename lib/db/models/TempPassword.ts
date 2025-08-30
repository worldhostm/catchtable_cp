import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITempPassword extends Document {
  userId: Types.ObjectId;
  tempPassword: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const tempPasswordSchema = new Schema<ITempPassword>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tempPassword: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

tempPasswordSchema.index({ userId: 1 });
tempPasswordSchema.index({ expiresAt: 1 });
tempPasswordSchema.index({ createdAt: 1 });

export const TempPassword = mongoose.models.TempPassword || mongoose.model<ITempPassword>('TempPassword', tempPasswordSchema);