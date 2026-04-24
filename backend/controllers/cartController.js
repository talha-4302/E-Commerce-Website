import db from "../config/database.js";

// @desc    Add item to cart (Upsert pattern)
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.userId;

        if (!productId || !size || !quantity) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const query = `
            INSERT INTO cart_items (user_id, product_id, size, quantity)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        `;

        await db.execute(query, [userId, productId, size, quantity]);

        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.userId;

        if (quantity <= 0) {
            await db.execute(
                "DELETE FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?",
                [userId, productId, size]
            );
            return res.json({ success: true, message: "Item removed from cart" });
        }

        await db.execute(
            "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ? AND size = ?",
            [quantity, userId, productId, size]
        );

        res.json({ success: true, message: "Cart updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const { productId, size } = req.body;
        const userId = req.userId;

        await db.execute(
            "DELETE FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?",
            [userId, productId, size]
        );

        res.json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Get all cart items for a user
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const userId = req.userId;

        const query = `
            SELECT 
                ci.product_id as id, ci.size, ci.quantity,
                p.name, p.price,
                (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `;

        const [rows] = await db.execute(query, [userId]);

        res.json({ success: true, cartData: rows });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCartItem, removeFromCart, getCart };
