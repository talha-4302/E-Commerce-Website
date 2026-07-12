import db from '../config/database.js';
import { PRODUCT_STATUS } from '../constants/index.js';

const findWishlistByUser = async (userId) => {
    const query = `
        SELECT
            wi.product_id as id,
            p.name, p.price, p.description, p.category, p.sub_category as subCategory,
            (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
        FROM wishlist_items wi
        JOIN products p ON wi.product_id = p.id
        WHERE wi.user_id = ? AND p.product_status = '${PRODUCT_STATUS.ACTIVE}'
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
};

const findSizesForProducts = async (productIds) => {
    const placeholders = productIds.map(() => "?").join(",");
    const [rows] = await db.execute(
        `SELECT product_id, size FROM product_sizes WHERE product_id IN (${placeholders})`,
        productIds
    );
    return rows;
};

const insertIgnore = async (userId, productId) => {
    // INSERT IGNORE silently skips if UNIQUE constraint is violated
    await db.execute(
        "INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)",
        [userId, productId]
    );
};

const deleteItem = async (userId, productId) => {
    await db.execute(
        "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?",
        [userId, productId]
    );
};

export default { findWishlistByUser, findSizesForProducts, insertIgnore, deleteItem };
