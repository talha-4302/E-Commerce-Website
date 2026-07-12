import db from '../config/database.js';
import orderRepository from '../repositories/order.repository.js';
import AppError from '../utils/AppError.js';
import { ORDER_STATUS } from '../constants/index.js';

const placeOrder = async (userId, { shippingAddress, paymentMethod, totalAmount }) => {
    if (!shippingAddress || !paymentMethod || !totalAmount) {
        throw new AppError("Missing required fields");
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert into orders table
        const orderId = await orderRepository.createOrder(connection, {
            userId, totalAmount, paymentMethod, shippingAddress
        });

        // 2. Get current cart items for the user with their current prices
        const cartItems = await orderRepository.getCartItemsForOrder(connection, userId);

        const actualTotalAmount = cartItems.reduce(
            (total, item) => total + (item.price * item.quantity), 0
        ) + 10;

        if (actualTotalAmount !== totalAmount) {
            throw new AppError("Maintainance in place, Please Refresh and try again.");
        }

        if (cartItems.length === 0) {
            throw new AppError("Cart is empty");
        }

        // 3. Insert into order_items (snapshotting prices)
        for (const item of cartItems) {
            await orderRepository.createOrderItem(connection, {
                orderId,
                productId: item.product_id,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            });
        }

        // 4. Delete all cart items for the user
        await orderRepository.clearCart(connection, userId);

        await connection.commit();
        return orderId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getUserOrders = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalItems = await orderRepository.countUserOrders(userId);
    const totalPages = Math.ceil(totalItems / limit);
    const pagination = { currentPage: page, totalPages, totalItems, limit };

    const orders = await orderRepository.findUserOrdersPaginated(userId, limit, offset);

    if (orders.length === 0) {
        return { orders: [], pagination };
    }

    const orderIds = orders.map((o) => o.id);
    const itemRows = await orderRepository.findOrderItemsForUser(orderIds);

    const ordersData = orders.map((order) => ({
        ...order,
        items: itemRows.filter((row) => row.order_id === order.id)
    }));

    return { orders: ordersData, pagination };
};

// --- admin ---

const getAllOrders = async (query) => {
    const { status } = query;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalItems = await orderRepository.countAllOrders(status);
    const totalPages = Math.ceil(totalItems / limit);
    const pagination = { currentPage: page, totalPages, totalItems, limit };

    const orders = await orderRepository.findAllOrdersPaginated(status, limit, offset);

    if (orders.length === 0) {
        return { orders: [], pagination };
    }

    // Batch fetch items for all orders to avoid N+1 problem
    const orderIds = orders.map((o) => o.id);
    const itemRows = await orderRepository.findOrderItemsForAdmin(orderIds);

    const ordersData = orders.map((order) => ({
        ...order,
        items: itemRows.filter((row) => row.order_id === order.id)
    }));

    return { orders: ordersData, pagination };
};

const updateOrderStatus = async (id, status) => {
    const allowedStatuses = Object.values(ORDER_STATUS);
    if (!allowedStatuses.includes(status)) {
        throw new AppError("Invalid status value");
    }

    const affectedRows = await orderRepository.updateStatus(id, status);
    if (affectedRows === 0) {
        throw new AppError("Order not found");
    }
};

export default { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };
