//GET /products (supports ?productId= filter), POST /products,
//  GET /products/:id, PUT /products/:id, DELETE /products/:id.

import { Router } from 'express';
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/products.ts';
import { validateBody } from '../middleware/validateBody.ts';
import { productInputSchema } from '../models/Product.ts';

const app = Router();

app.get('/products', getProducts);
app.post('/products', validateBody(productInputSchema), createProduct);
app.get('/products/:id', getProductById);
app.put('/products/:id', validateBody(productInputSchema), updateProduct);
app.delete('/products/:id', deleteProduct);

export default app;
