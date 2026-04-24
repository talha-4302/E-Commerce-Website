import express from 'express';
import { placeOrder, getUserOrders } from '../controllers/orderController.js';
import { authUser } from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/place', authUser, placeOrder);
orderRouter.get('/', authUser, getUserOrders);

export default orderRouter;
