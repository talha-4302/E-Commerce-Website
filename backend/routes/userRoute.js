import express from 'express';
import { loginUser, registerUser, adminLogin, verifyToken } from '../controllers/userController.js';
import { authUser, authAdmin } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/verify', authUser, verifyToken);
userRouter.get('/verify-admin', authAdmin, verifyToken);
export default userRouter;
