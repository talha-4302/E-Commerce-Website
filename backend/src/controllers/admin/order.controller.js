import orderService from '../../services/order.service.js';
import catchAsync from '../../utils/catchAsync.js';

const getAllOrders = catchAsync(async (req, res) => {
    const { orders, pagination } = await orderService.getAllOrders(req.query);
    res.json({ success: true, orders, pagination });
});

const updateOrderStatus = catchAsync(async (req, res) => {
    await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.json({ success: true, message: "Order status updated successfully" });
});

export { getAllOrders, updateOrderStatus };
