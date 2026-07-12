import db from '../config/database.js';
import { PRODUCT_STATUS } from '../constants/index.js';

const findProductStatus = async (productId) => {
    const [rows] = await db.execute("SELECT product_status FROM products WHERE id = ?", [productId]);
    return rows[0] || null;
};

const upsertCartItem = async (userId, productId, size, quantity) => {
    const query = `
        INSERT INTO cart_items (user_id, product_id, size, quantity)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;
    await db.execute(query, [userId, productId, size, quantity]);
};

const deleteCartItem = async (userId, productId, size) => {
    await db.execute(
        "DELETE FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?",
        [userId, productId, size]
    );
};

const updateQuantity = async (userId, productId, size, quantity) => {
    await db.execute(
        "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ? AND size = ?",
        [quantity, userId, productId, size]
    );
};

const findCartByUser = async (userId) => {
    const query = `
        SELECT
            ci.product_id as id, ci.size, ci.quantity,
            p.name, p.price,
            (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ? AND p.product_status = '${PRODUCT_STATUS.ACTIVE}'
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
};

export default { findProductStatus, upsertCartItem, deleteCartItem, updateQuantity, findCartByUser };
