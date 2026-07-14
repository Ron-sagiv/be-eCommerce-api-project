import type { RequestHandler, Request, Response } from 'express';
import User, { type userInput } from '../models/User.ts';

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    console.log(users);
    return res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An unknown error occurred' });
  }
};

export const createUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body as userInput;
    if (!name || !email || !password)
      return res.status(400).json({
        error: 'name, email, and password are required',
      });

    const found = await User.findOne({ email });

    if (found) return res.status(400).json({ error: 'User already exists' });
    const user = await User.create<userInput>({
      name,
      email,
      password,
    });
    return res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({
      message: 'An unknown error occurred',
    });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
///////////first version of updateUser//////////////////////////////////
// export const updateUser: RequestHandler = async (req, res) => {
//   try {
//     const {
//       body,
//       params: { id },
//     } = req;
//     const { name, email } = body as userInput;
//     if (!name || !email)
//       return res.status(400).json({ error: 'name, and email are required' });
//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     user.name = name;
//     user.email = email;
//     await user.save();
//     return res.json(user);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return res.status(500).json({ message: error.message });
//     } else {
//       return res.status(500).json({ message: 'An unknown error occurred' });
//     }
//   }
// };
///////////Second version of updateUser//////////////////////////////////
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body as userInput;

    if (!name || !email) {
      return res.status(400).json({
        error: 'name and email are required',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    user.name = name;
    user.email = email;

    await user.save();

    return res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: 'An unknown error occurred',
    });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ message: 'User deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
