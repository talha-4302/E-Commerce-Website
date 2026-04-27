import db from "../../config/database.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        // Run queries in parallel for efficiency
        const [
            [statsRows],
            [statusRows],
            [recentOrderRows],
            [bestSellerRows]
        ] = await Promise.all([
            // Q1: Total counts
            db.execute(`
                SELECT 
                    (SELECT COUNT(*) FROM orders) AS totalOrders,
                    (SELECT COUNT(*) FROM users WHERE role != 'admin') AS totalUsers,
                    (SELECT COUNT(*) FROM products) AS totalProducts
            `),
            // Q2: Order status breakdown
            db.execute(`
                SELECT status, COUNT(*) AS count 
                FROM orders 
                GROUP BY status
            `),
            // Q3: Recent 5 orders with customer info
            db.execute(`
                SELECT o.id, o.total_amount, o.status, o.created_at,
                       u.name AS customer_name, u.email AS customer_email
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
                LIMIT 5
            `),
            // Q4: Bestseller products (with first image)
            db.execute(`
                SELECT p.id, p.name, p.price,
                       (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
                FROM products p
                WHERE p.bestseller = 1
                LIMIT 6
            `)
        ]);

        const stats = statsRows[0];
        const orderStatus = statusRows;
        const recentOrders = recentOrderRows;
        const bestSellers = bestSellerRows;

        res.json({
            success: true,
            stats,
            orderStatus,
            recentOrders,
            bestSellers
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getDashboardStats };
