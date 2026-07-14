import { Router } from 'express';
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/users.ts';
import { validateBody } from '../middleware/validateBody.ts';
import { userInputSchema } from '../models/User.ts';

const app = Router();

app.get('/users', getUsers);
app.post('/users', validateBody(userInputSchema), createUser);
app.get('/users/:id', getUserById);
app.put('/users/:id', validateBody(userInputSchema), updateUser);
app.delete('/users/:id', deleteUser);

export default app;
