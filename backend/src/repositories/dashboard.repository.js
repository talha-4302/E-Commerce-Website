import db from '../config/database.js';
import { PRODUCT_STATUS } from '../constants/index.js';

const getStats = async () => {
    // Run all four queries in parallel for efficiency
    const [
        [statsRows],
        [statusRows],
        [recentOrderRows],
        [bestSellerRows]
    ] = await Promise.all([
        db.execute(`
            SELECT
                (SELECT COUNT(*) FROM orders) AS totalOrders,
                (SELECT COUNT(*) FROM users WHERE role != 'admin') AS totalUsers,
                (SELECT COUNT(*) FROM products WHERE product_status = '${PRODUCT_STATUS.ACTIVE}') AS totalProducts
        `),
        db.execute(`
            SELECT status, COUNT(*) AS count
            FROM orders
            GROUP BY status
        `),
        db.execute(`
            SELECT o.id, o.total_amount, o.status, o.created_at,
                   u.name AS customer_name, u.email AS customer_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 10
        `),
        db.execute(`
            SELECT p.id, p.name, p.price,
                   (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
            FROM products p
            WHERE p.bestseller = 1 AND p.product_status = '${PRODUCT_STATUS.ACTIVE}'
            LIMIT 5
        `)
    ]);

    return {
        stats: statsRows[0],
        orderStatus: statusRows,
        recentOrders: recentOrderRows,
        bestSellers: bestSellerRows
    };
};

export default { getStats };
