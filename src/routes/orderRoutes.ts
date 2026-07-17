import { Router } from 'express';
import {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/orders.ts';
import { validateBody } from '../middleware/validateBody.ts';
import { orderInputSchema } from '../models/Order.ts';

const app = Router();

app.get('/orders', getOrders);
app.post('/orders', validateBody(orderInputSchema), createOrder);
app.get('/orders/:id', getOrderById);
app.put('/orders/:id', validateBody(orderInputSchema), updateOrder);
app.delete('/orders/:id', deleteOrder);

export default app;
