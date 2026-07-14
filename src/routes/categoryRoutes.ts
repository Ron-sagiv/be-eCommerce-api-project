import { Router } from 'express';
import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.ts';
import { validateBody } from '../middleware/validateBody.ts';
import { categoryInputSchema } from '../models/Category.ts';

const app = Router();

app.get('/categories', getCategories);
app.post('/categories', validateBody(categoryInputSchema), createCategory);
app.get('/categories/:id', getCategoryById);
app.put('/categories/:id', validateBody(categoryInputSchema), updateCategory);
app.delete('/categories/:id', deleteCategory);

export default app;
