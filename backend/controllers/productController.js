import db from "../config/database.js";

// ---------------------------------------------------------------
// Helper: turn a comma-separated string into a clean array
// e.g. "Men,Women" → ["Men", "Women"]
// ---------------------------------------------------------------
const toArray = (value) => {
    if (!value) return [];
    return value.split(",").map((v) => v.trim()).filter(Boolean);
};

// ---------------------------------------------------------------
// @desc    List products with optional dynamic filters & sorting
// @route   GET /api/product/list
// @access  Public
// @params  category, subCategory, minPrice, maxPrice, search, sortBy
//
// Pattern: Dynamic Query Builder
// We start with a safe base (WHERE 1=1) and conditionally append
// AND clauses only for the filters the client actually sent.
// ---------------------------------------------------------------
const listProducts = async (req, res) => {
    try {
        const { category, subCategory, minPrice, maxPrice, search, sortBy } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const status = req.query.status;

        // --- Build the WHERE clause dynamically ---
        let conditions = status === 'all' ? 'WHERE 1=1' : "WHERE p.product_status = 'active'";
        const params = [];

        // Filter by category (comma-separated → array)
        const categories = toArray(category);
        if (categories.length > 0) {
            const placeholders = categories.map(() => "?").join(", ");
            conditions += ` AND p.category IN (${placeholders})`;
            params.push(...categories);
        }

        // Filter by sub-category
        const subCategories = toArray(subCategory);
        if (subCategories.length > 0) {
            const placeholders = subCategories.map(() => "?").join(", ");
            conditions += ` AND p.sub_category IN (${placeholders})`;
            params.push(...subCategories);
        }

        // Filter by minimum price
        if (minPrice !== undefined && minPrice !== "") {
            conditions += " AND p.price >= ?";
            params.push(Number(minPrice));
        }

        // Filter by maximum price
        if (maxPrice !== undefined && maxPrice !== "") {
            conditions += " AND p.price <= ?";
            params.push(Number(maxPrice));
        }

        // Search by product name (LIKE %term%)
        if (search && search.trim() !== "") {
            conditions += " AND p.name LIKE ?";
            params.push(`%${search.trim()}%`);
        }

        // --- Step 1: Count total matching rows (for pagination) ---
        // We reuse the same conditions but skip ORDER BY and correlated subqueries
        const countQuery = `SELECT COUNT(*) AS total FROM products p ${conditions}`;
        const [countRows] = await db.execute(countQuery, [...params]);
        const totalItems = countRows[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // --- Build ORDER BY clause ---
        // We pick from a safe whitelist — never inject user input directly.
        let orderBy = "ORDER BY p.id "; // default: newest first
        if (sortBy === "price_asc") orderBy = "ORDER BY p.price ASC";
        else if (sortBy === "price_desc") orderBy = "ORDER BY p.price DESC";
        else if (sortBy === "newest") orderBy = "ORDER BY p.created_at DESC";

        // --- Assemble the final query ---
        // Correlated subquery grabs exactly ONE image per product.
        const query = `
            SELECT
                p.*,
                (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
            FROM products p
            ${conditions}
            ${orderBy}
            LIMIT ? OFFSET ?
        `;

        // Add limit and offset to params
        params.push(limit, offset);

        const [rows] = await db.execute(query, params);

        res.json({
            success: true,
            products: rows,
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

// ---------------------------------------------------------------
// @desc    Get a single product by ID (with ALL images & sizes)
// @route   GET /api/product/single/:id
// @access  Public
//
// Pattern: Data Stitching
// We run 3 simple queries and merge them in JS, rather than one
// complex JOIN that would create a Cartesian explosion.
// ---------------------------------------------------------------
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Query 1: Base product data
        const [productRows] = await db.execute(
            "SELECT * FROM products WHERE id = ? LIMIT 1",
            [id]
        );

        if (productRows.length === 0) {
            return res.json({ success: false, message: "Product not found" });
        }

        const product = productRows[0];

        // Query 2: All images for this product
        const [imageRows] = await db.execute(
            "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY id ASC",
            [id]
        );

        // Query 3: All sizes for this product
        const [sizeRows] = await db.execute(
            "SELECT size FROM product_sizes WHERE product_id = ? ORDER BY id ASC",
            [id]
        );

        // Stitch the related data onto the product object
        product.images = imageRows.map((r) => r.image_url);
        product.sizes = sizeRows.map((r) => r.size);

        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// ---------------------------------------------------------------
// @desc    Get the 10 latest products (Homepage "New Arrivals")
// @route   GET /api/product/latest
// @access  Public
// ---------------------------------------------------------------
const getLatestProducts = async (req, res) => {
    try {
        const query = `
            SELECT
                p.*,
                (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
            FROM products p
            WHERE p.product_status = 'active'
            ORDER BY p.created_at DESC
            LIMIT 8
        `;

        const [rows] = await db.execute(query);

        res.json({ success: true, products: rows });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listProducts, getProductById, getLatestProducts };
