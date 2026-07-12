import express from 'express';
import { getAllOrders, updateOrderStatus } from '../../controllers/admin/order.controller.js';

const router = express.Router();

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;
