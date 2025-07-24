import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { sequelize } from './models/index.js';
import userRouter from './routes/userRoute.js';
import noteRouter from './routes/noteRouter.js';

const app = express();
app.use(express.json());

const PORT = 8000;

app.use(cors({
    origin: "*",
}))

try {
  const result = await sequelize.sync()
  console.log(result);
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use('/users', userRouter);
app.use('/notes', noteRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})