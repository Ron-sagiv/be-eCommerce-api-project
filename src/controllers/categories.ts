import type { RequestHandler, Request, Response } from 'express';
import Category, { type categoryInput } from '../models/Category.ts';

export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories.length) res.send('No categories in the DB');

    console.log(categories);
    return res.json(categories);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body as categoryInput;
    if (!name)
      return res.status(400).json({
        error: 'name of the category is required',
      });
    const found = await Category.findOne({ name });
    if (found)
      return res.status(400).json({ error: 'category already exists' });
    const category = await Category.create(
      // <categoryInput>
      {
        name,
      },
    );
    res.json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
export const getCategoryById: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updateCategory: RequestHandler = async (req, res) => {
  try {
    const {
      body,
      params: { id },
    } = req;
    const { name } = body as categoryInput;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    category.name = name;
    await category.save();
    return res.json(category);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.json({ message: 'Category deleted' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
