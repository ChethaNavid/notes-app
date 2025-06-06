import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import noteRouter from './routes/noteRouter.js';

const app = express();
app.use(express.json());

const PORT = 8000;

app.use(cors({
    origin: "*",
}))

app.use('/users', userRouter);
app.use('/notes', noteRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})