import db from "../config/database.js";

// @desc    Get all wishlist items for a user
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        // Query 1: Get wishlist items with product details
        const query = `
            SELECT 
                wi.product_id as id,
                p.name, p.price, p.description, p.category, p.sub_category as subCategory,
                (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
            FROM wishlist_items wi
            JOIN products p ON wi.product_id = p.id
            WHERE wi.user_id = ?
        `;

        const [wishlistItems] = await db.execute(query, [userId]);

        if (wishlistItems.length === 0) {
            return res.json({ success: true, wishlistData: [] });
        }

        // Query 2: Fetch all sizes for these products
        const productIds = wishlistItems.map(item => item.id);
        const placeholders = productIds.map(() => "?").join(",");
        const sizeQuery = `SELECT product_id, size FROM product_sizes WHERE product_id IN (${placeholders})`;
        
        const [sizeRows] = await db.execute(sizeQuery, productIds);

        // Stitch sizes into wishlist items
        const wishlistData = wishlistItems.map(item => ({
            ...item,
            sizes: sizeRows.filter(row => row.product_id === item.id).map(row => row.size)
        }));

        res.json({ success: true, wishlistData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        if (!productId) {
            return res.json({ success: false, message: "Missing product ID" });
        }

        // INSERT IGNORE silently skips if UNIQUE constraint is violated
        await db.execute(
            "INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)",
            [userId, productId]
        );

        res.json({ success: true, message: "Added to wishlist" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/remove
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId;

        await db.execute(
            "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        res.json({ success: true, message: "Removed from wishlist" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getWishlist, addToWishlist, removeFromWishlist };
