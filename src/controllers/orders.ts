// GET /orders, POST /orders, GET /orders/:id, PUT /orders/:id, DELETE /orders/:id.
//Compute total from the current product prices × quantities during
// order create/update on the server.

import type { RequestHandler, Request, Response } from 'express';
import mongoose from 'mongoose';
import Order, { type orderInput } from '../models/Order.ts';
import User from '../models/User.ts';
import Product from '../models/Product.ts';

export const getOrders: RequestHandler = async (req, res) => {
  try {
    ////check out the ppulate! need to have userID and ProductID
    const orders = await Order.find()
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .populate({
        path: 'products.productId',
        select: 'name price',
      });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    console.log(orders);
    return res.json(orders);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An unknown error occurred' });
  }
};

export const createOrder: RequestHandler = async (req, res) => {
  try {
    const { userId, products } = req.body as orderInput;

    // Check required fields
    if (!userId || !products) {
      return res.status(400).json({
        error: 'userId and products are required',
      });
    }

    // Check user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Calculate total while validating every product
    let total = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          error: `Product ${item.productId} not found`,
        });
      }

      total += product.price * item.quantity;
    }

    // Create the order
    const order = await Order.create({
      userId,
      products,
      total,
    });

    // Populate referenced documents
    await order.populate('userId');
    await order.populate('products.productId');

    return res.status(201).json(order);
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

export const getOrderById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid order id',
      });
    }
    const order = await Order.findById(id)
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .populate({
        path: 'products.productId',
        select: 'name price',
      });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updateOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate order id
    if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid order id',
      });
    }

    const { userId, products } = req.body as orderInput;

    // Validate request body
    if (!userId || !products) {
      return res.status(400).json({
        error: 'userId and products are required',
      });
    }

    // Check user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Check order exists
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
      });
    }

    // Validate products and calculate total
    let total = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          error: `Product ${item.productId} not found`,
        });
      }

      total += product.price * item.quantity;
    }

    // Update order
    order.set({
      userId,
      products,
      total,
    });

    await order.save();

    // Populate references
    await order.populate({
      path: 'userId',
      select: 'name email',
    });

    await order.populate({
      path: 'products.productId',
      select: 'name price',
    });

    return res.json(order);
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

export const deleteOrder: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json({ message: 'Order deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
