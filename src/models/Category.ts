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
      required: [true, 'Name is required'],
      trim: true,
      unique: true,
      minlength: [3, 'Name of category must be at least 3 characters long'],
    },
  },
  {
    timestamps: true,
  },
);
///////////this converts _id to id/////////////////////
/////////////////////////////////////////////////////////
set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete (converted as Partial<typeof converted>)._id;
  },
});

export type categoryInput = z.infer<typeof categoryInputSchema>;
export default mongoose.model('Category', categorySchema);
