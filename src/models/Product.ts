//Fields: name, description, price (number), categoryId (ObjectId ref to Category).

import { Schema, model, set } from 'mongoose';
import mongoose from 'mongoose';
import z, { number } from 'zod';

export const productInputSchema = z.strictObject({
  name: z.string().min(3, 'min lentgh is 3 chars'),
  price: z.number().positive(),
  description: z.string().min(4, 'min lentgh is 4 chars'),
  categoryId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid category id',
  }),
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      unique: true,
      minlength: [3, 'Name of product must be at least 3 characters long'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [4, 'Description must be at least 4 characters long'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
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

export type productInput = z.infer<typeof productInputSchema>;
export default mongoose.model('Product', productSchema);
