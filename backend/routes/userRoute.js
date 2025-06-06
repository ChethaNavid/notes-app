import express from 'express';
import { createNewAccount, getUser, login } from '../controllers/userController.js';
import authenticateToken from '../middleware/authentication.js';

const userRouter = express.Router(); 

userRouter.post('/create-account', createNewAccount);
userRouter.post('/login', login);
userRouter.get('/get-user', authenticateToken, getUser);

export default userRouter;