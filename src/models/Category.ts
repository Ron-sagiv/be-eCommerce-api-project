import { Schema, model, set } from 'mongoose';
import mongoose from 'mongoose';
import z from 'zod';

export const categoryInputSchema = z.strictObject({
  name: z.string().min(2, 'min lentgh is 2 chars'),
});

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete (converted as Partial<typeof converted>)._id;
  },
});

export type categoryInput = z.infer<typeof categoryInputSchema>;
export default mongoose.model('Category', categorySchema);
