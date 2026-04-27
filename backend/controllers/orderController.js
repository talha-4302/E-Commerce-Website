import db from "../config/database.js";

// @desc    Place a new order (Transactional)
// @route   POST /api/order/place
// @access  Private
const placeOrder = async (req, res) => {
    let connection;
    try {
        const { shippingAddress, paymentMethod, totalAmount } = req.body;
        const userId = req.userId;

        if (!shippingAddress || !paymentMethod || !totalAmount) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Insert into orders table
        const [orderResult] = await connection.execute(
            "INSERT INTO orders (user_id, total_amount, payment_method, shipping_address) VALUES (?, ?, ?, ?)",
            [userId, totalAmount, paymentMethod, shippingAddress]
        );

        const orderId = orderResult.insertId;

        // 2. Get current cart items for the user with their current prices
        const cartQuery = `
            SELECT ci.product_id, ci.size, ci.quantity, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `;
        const [cartItems] = await connection.execute(cartQuery, [userId]);

        if (cartItems.length === 0) {
            await connection.rollback();
            return res.json({ success: false, message: "Cart is empty" });
        }

        // 3. Insert into order_items (snapshotting prices)
        const orderItemQuery = `
            INSERT INTO order_items (order_id, product_id, size, quantity, price)
            VALUES (?, ?, ?, ?, ?)
        `;

        for (const item of cartItems) {
            await connection.execute(orderItemQuery, [
                orderId,
                item.product_id,
                item.size,
                item.quantity,
                item.price
            ]);
        }

        // 4. Delete all cart items for the user
        await connection.execute("DELETE FROM cart_items WHERE user_id = ?", [userId]);

        await connection.commit();
        res.json({ success: true, message: "Order placed successfully", orderId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.log(error);
        res.json({ success: false, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Get user order history
// @route   GET /api/order
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // --- Step 1: Count total orders for pagination ---
        const [countRows] = await db.execute(
            "SELECT COUNT(*) AS total FROM orders WHERE user_id = ?",
            [userId]
        );
        const totalItems = countRows[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // --- Step 2: Get paginated orders for the user ---
        const [orders] = await db.execute(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
            [userId, limit, offset]
        );

        if (orders.length === 0) {
            return res.json({ 
                success: true, 
                orders: [],
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    limit
                }
            });
        }

        // Query 2: Get all items for these orders with product details
        const orderIds = orders.map(o => o.id);
        const placeholders = orderIds.map(() => "?").join(",");
        
        const itemsQuery = `
            SELECT oi.*, p.name, 
                   (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image
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

        res.json({ 
            success: true, 
            orders: ordersData,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                limit
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, getUserOrders };
