import express from 'express';
import { addToCart, updateCartItem, removeFromCart, getCart } from '../controllers/cartController.js';
import { authUser } from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.get('/', authUser, getCart);
cartRouter.post('/add', authUser, addToCart);
cartRouter.put('/update', authUser, updateCartItem);
cartRouter.post('/remove', authUser, removeFromCart);

export default cartRouter;
