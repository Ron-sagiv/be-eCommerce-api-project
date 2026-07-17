// Fields: userId (ObjectId ref to User),
//  products (array of { productId: ObjectId, quantity: number }),
// total (number), plus timestamps.

import mongoose from 'mongoose';
import z from 'zod';
import { set } from 'mongoose';

export const orderInputSchema = z.strictObject({
  userId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid user id',
  }),
  products: z
    .array(
      z.strictObject({
        productId: z
          .string()
          .refine((id) => mongoose.Types.ObjectId.isValid(id), {
            message: 'Invalid product id',
          }),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, 'Order must contain at least one product'),
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

///////////this converts _id to id/////////////////////
/////////////////////////////////////////////////////////
orderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete (converted as Partial<typeof converted>)._id;
  },
});

export type orderInput = z.infer<typeof orderInputSchema>;
export default mongoose.model('Order', orderSchema);
