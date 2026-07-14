import { Schema, model, set } from 'mongoose';
import mongoose from 'mongoose';
import z, { email } from 'zod';

export const userInputSchema = z.strictObject({
  name: z.string().min(2, 'min lentgh is 2 chars'),
  email: z.email(),
  password: z.string().min(8, 'min lentgh is 8 chars'),
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      minlength: [6, 'Password must be at least 6 characters long'],
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

export type userInput = z.infer<typeof userInputSchema>;
export default mongoose.model('User', userSchema);
