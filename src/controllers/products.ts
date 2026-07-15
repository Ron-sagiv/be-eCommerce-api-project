//GET /products (supports ?categoryId= filter), POST /products,
//  GET /products/:id, PUT /products/:id, DELETE /products/:id.

import type { RequestHandler, Request, Response } from 'express';
import Product, { type productInput } from '../models/Product.ts';
import Category from '../models/Category.ts';

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId');

    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    console.log(products);
    return res.json(products);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An unknown error occurred' });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body as productInput;
    if (!name || price === undefined || !description || !categoryId)
      return res.status(400).json({
        error: 'name, price, and description are required',
      });
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
      });
    }

    const found = await Product.findOne({ name });

    if (found) return res.status(400).json({ error: 'Product already exists' });
    const product = await Product.create<productInput>({
      name,
      price,
      description,
      categoryId,
    });
    return res.status(201).json(product);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({
      message: 'An unknown error occurred',
    });
  }
};
export const getProductById: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const product = await Product.findById(id).populate('categoryId');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json(product);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, categoryId } = req.body as productInput;

    if (!name || price === undefined || !description || !categoryId) {
      return res.status(400).json({
        error: 'name, price, description and category id are required',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
      });
    }
    product.categoryId = category._id;

    product.name = name;
    product.price = price;
    product.description = description;
    product.categoryId = category._id;

    await product.save();

    return res.json(product);
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

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json({ message: 'Product deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
