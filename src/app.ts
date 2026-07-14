import express from 'express';
import connectDb from './db/index.ts';
import cors from 'cors';
import usersRoute from './routes/userRoutes.ts';
import categoryRoute from './routes/categoryRoutes.ts';

const app = express();
const port = process.env.PORT || 8080;

connectDb();

//middleware
app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//   res.send('eCommerce API');
// });

app.use('/api/', usersRoute);
app.use('/api/', categoryRoute);

app.listen(port, () =>
  console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`),
);
