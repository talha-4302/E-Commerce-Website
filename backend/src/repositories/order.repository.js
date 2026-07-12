import db from '../config/database.js';
import { PRODUCT_STATUS } from '../constants/index.js';

// --- transactional writes (caller manages the transaction) ---

const createOrder = async (connection, { userId, totalAmount, paymentMethod, shippingAddress }) => {
    const [result] = await connection.execute(
        "INSERT INTO orders (user_id, total_amount, payment_method, shipping_address) VALUES (?, ?, ?, ?)",
        [userId, totalAmount, paymentMethod, shippingAddress]
    );
    return result.insertId;
};

const getCartItemsForOrder = async (connection, userId) => {
    const query = `
        SELECT ci.product_id, ci.size, ci.quantity, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ? AND p.product_status = '${PRODUCT_STATUS.ACTIVE}'
    `;
    const [rows] = await connection.execute(query, [userId]);
    return rows;
};

const createOrderItem = async (connection, { orderId, productId, size, quantity, price }) => {
    await connection.execute(
        "INSERT INTO order_items (order_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [orderId, productId, size, quantity, price]
    );
};

const clearCart = async (connection, userId) => {
    await connection.execute("DELETE FROM cart_items WHERE user_id = ?", [userId]);
};

// --- user-facing reads ---

const countUserOrders = async (userId) => {
    const [rows] = await db.execute("SELECT COUNT(*) AS total FROM orders WHERE user_id = ?", [userId]);
    return rows[0].total;
};

const findUserOrdersPaginated = async (userId, limit, offset) => {
    const [rows] = await db.execute(
        `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        [userId]
    );
    return rows;
};

const findOrderItemsForUser = async (orderIds) => {
    const placeholders = orderIds.map(() => "?").join(",");
    const query = `
        SELECT oi.*,
               COALESCE(p.name, 'Product Unavailable') AS name,
               COALESCE(
                   (SELECT image_url FROM product_images WHERE product_id = oi.product_id LIMIT 1),
                   NULL
               ) AS image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (${placeholders})
    `;
    const [rows] = await db.execute(query, orderIds);
    return rows;
};

// --- admin ---

const countAllOrders = async (status) => {
    let countQuery = "SELECT COUNT(*) AS total FROM orders";
    const params = [];
    if (status && status !== 'All') {
        countQuery += " WHERE status = ?";
        params.push(status);
    }
    const [rows] = await db.execute(countQuery, params);
    return rows[0].total;
};

const findAllOrdersPaginated = async (status, limit, offset) => {
    let query = `
        SELECT o.*, u.name AS customer_name, u.email AS customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    if (status && status !== 'All') {
        query += " WHERE o.status = ?";
        params.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, params);
    return rows;
};

const findOrderItemsForAdmin = async (orderIds) => {
    const placeholders = orderIds.map(() => "?").join(",");
    const query = `
        SELECT oi.*,
               COALESCE(p.name, 'Product Unavailable') AS product_name,
               COALESCE(
                   (SELECT image_url FROM product_images WHERE product_id = oi.product_id LIMIT 1),
                   NULL
               ) AS image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (${placeholders})
    `;
    const [rows] = await db.execute(query, orderIds);
    return rows;
};

const updateStatus = async (id, status) => {
    const [result] = await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    return result.affectedRows;
};

export default {
    createOrder,
    getCartItemsForOrder,
    createOrderItem,
    clearCart,
    countUserOrders,
    findUserOrdersPaginated,
    findOrderItemsForUser,
    countAllOrders,
    findAllOrdersPaginated,
    findOrderItemsForAdmin,
    updateStatus
};
