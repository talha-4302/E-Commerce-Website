import db from "../../config/database.js";

// @desc    Get all orders with optional status filter
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
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

        query += " ORDER BY o.created_at DESC";

        const [orders] = await db.execute(query, params);

        if (orders.length === 0) {
            return res.json({ success: true, orders: [] });
        }

        // Batch fetch items for all orders to avoid N+1 problem
        const orderIds = orders.map(o => o.id);
        const placeholders = orderIds.map(() => "?").join(",");
        
        const itemsQuery = `
            SELECT oi.*, p.name AS product_name,
                   (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id IN (${placeholders})
        `;

        const [itemRows] = await db.execute(itemsQuery, orderIds);

        // Stitch items into orders
        const ordersData = orders.map(order => ({
            ...order,
            items: itemRows.filter(row => row.order_id === order.id)
        }));

        res.json({ success: true, orders: ordersData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status value" });
        }

        const [result] = await db.execute(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order status updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getAllOrders, updateOrderStatus };
