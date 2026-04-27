import db from "../../config/database.js";

// @desc    Add a new product
// @route   POST /api/admin/products
// @access  Private (Admin)
const addProduct = async (req, res) => {
    let connection;
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller, images } = req.body;

        if (!name || !price || !description || !images || images.length === 0) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Insert product
        const [productResult] = await connection.execute(
            "INSERT INTO products (name, description, price, category, sub_category, bestseller, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
            [name, description, price, category, subCategory, bestSeller ? 1 : 0]
        );

        const productId = productResult.insertId;

        // 2. Insert images (max 4 as per requirement)
        const cleanImages = images.slice(0, 4);
        for (const imageUrl of cleanImages) {
            if (imageUrl.trim()) {
                await connection.execute(
                    "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
                    [productId, imageUrl.trim()]
                );
            }
        }

        // 3. Insert sizes
        if (sizes && sizes.length > 0) {
            for (const size of sizes) {
                await connection.execute(
                    "INSERT INTO product_sizes (product_id, size) VALUES (?, ?)",
                    [productId, size]
                );
            }
        }

        await connection.commit();
        res.json({ success: true, message: "Product added successfully", productId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.log(error);
        res.json({ success: false, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { name, description, price, category, subCategory, sizes, bestSeller, images } = req.body;

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Update product base info
        const [result] = await connection.execute(
            "UPDATE products SET name=?, description=?, price=?, category=?, sub_category=?, bestseller=? WHERE id=?",
            [name, description, price, category, subCategory, bestSeller ? 1 : 0, id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.json({ success: false, message: "Product not found" });
        }

        // 2. Update images (Replace approach: delete and re-insert)
        await connection.execute("DELETE FROM product_images WHERE product_id = ?", [id]);
        const cleanImages = images.slice(0, 4);
        for (const imageUrl of cleanImages) {
            if (imageUrl.trim()) {
                await connection.execute(
                    "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
                    [id, imageUrl.trim()]
                );
            }
        }

        // 3. Update sizes (Replace approach)
        await connection.execute("DELETE FROM product_sizes WHERE product_id = ?", [id]);
        if (sizes && sizes.length > 0) {
            for (const size of sizes) {
                await connection.execute(
                    "INSERT INTO product_sizes (product_id, size) VALUES (?, ?)",
                    [id, size]
                );
            }
        }

        await connection.commit();
        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        if (connection) await connection.rollback();
        console.log(error);
        res.json({ success: false, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute("DELETE FROM products WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, updateProduct, deleteProduct };
