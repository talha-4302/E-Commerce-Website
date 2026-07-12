import orderService from '../services/order.service.js';
import catchAsync from '../utils/catchAsync.js';

const placeOrder = catchAsync(async (req, res) => {
    const orderId = await orderService.placeOrder(req.userId, req.body);
    res.json({ success: true, message: "Order placed successfully", orderId });
});

const getUserOrders = catchAsync(async (req, res) => {
    const { orders, pagination } = await orderService.getUserOrders(req.userId, req.query);
    res.json({ success: true, orders, pagination });
});

export { placeOrder, getUserOrders };
