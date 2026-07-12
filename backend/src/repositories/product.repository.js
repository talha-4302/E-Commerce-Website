import db from '../config/database.js';
import { PRODUCT_STATUS } from '../constants/index.js';

// Pattern: Dynamic Query Builder.
// We start with a safe base (WHERE 1=1) and conditionally append AND clauses
// only for the filters the caller actually sent.
const buildListConditions = ({ category, subCategory, minPrice, maxPrice, search, status }) => {
    let conditions = status === 'all' ? 'WHERE 1=1' : `WHERE p.product_status = '${PRODUCT_STATUS.ACTIVE}'`;
    const params = [];

    if (category && category.length > 0) {
        conditions += ` AND p.category IN (${category.map(() => "?").join(", ")})`;
        params.push(...category);
    }

    if (subCategory && subCategory.length > 0) {
        conditions += ` AND p.sub_category IN (${subCategory.map(() => "?").join(", ")})`;
        params.push(...subCategory);
    }

    if (minPrice !== undefined && minPrice !== "") {
        conditions += " AND p.price >= ?";
        params.push(Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== "") {
        conditions += " AND p.price <= ?";
        params.push(Number(maxPrice));
    }

    if (search && search.trim() !== "") {
        conditions += " AND p.name LIKE ?";
        params.push(`%${search.trim()}%`);
    }

    return { conditions, params };
};

const countProducts = async (filters) => {
    const { conditions, params } = buildListConditions(filters);
    const [rows] = await db.execute(`SELECT COUNT(*) AS total FROM products p ${conditions}`, params);
    return rows[0].total;
};

const findProductsPaginated = async (filters, orderBy, limit, offset) => {
    const { conditions, params } = buildListConditions(filters);
    const query = `
        SELECT
            p.*,
            (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
        FROM products p
        ${conditions}
        ${orderBy}
        LIMIT ${limit} OFFSET ${offset}
    `;
    const [rows] = await db.execute(query, params);
    return rows;
};

const findById = async (id) => {
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
    return rows[0] || null;
};

const findImagesByProductId = async (productId) => {
    const [rows] = await db.execute(
        "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY id ASC",
        [productId]
    );
    return rows.map((r) => r.image_url);
};

const findSizesByProductId = async (productId) => {
    const [rows] = await db.execute(
        "SELECT size FROM product_sizes WHERE product_id = ? ORDER BY id ASC",
        [productId]
    );
    return rows.map((r) => r.size);
};

const findLatest = async () => {
    const query = `
        SELECT
            p.*,
            (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image
        FROM products p
        WHERE p.product_status = '${PRODUCT_STATUS.ACTIVE}'
        ORDER BY p.created_at DESC
        LIMIT 8
    `;
    const [rows] = await db.execute(query);
    return rows;
};

// --- admin / transactional writes (caller manages the transaction) ---

const insertProduct = async (connection, { name, description, price, category, subCategory, bestSeller }) => {
    const [result] = await connection.execute(
        "INSERT INTO products (name, description, price, category, sub_category, bestseller, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [name, description, price, category, subCategory, bestSeller ? 1 : 0]
    );
    return result.insertId;
};

const insertProductImage = async (connection, productId, imageUrl) => {
    await connection.execute(
        "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
        [productId, imageUrl]
    );
};

const insertProductSize = async (connection, productId, size) => {
    await connection.execute(
        "INSERT INTO product_sizes (product_id, size) VALUES (?, ?)",
        [productId, size]
    );
};

const updateProductBase = async (connection, id, { name, description, price, category, subCategory, bestSeller }) => {
    const [result] = await connection.execute(
        "UPDATE products SET name=?, description=?, price=?, category=?, sub_category=?, bestseller=? WHERE id=?",
        [name, description, price, category, subCategory, bestSeller ? 1 : 0, id]
    );
    return result.affectedRows;
};

const deleteProductImages = async (connection, productId) => {
    await connection.execute("DELETE FROM product_images WHERE product_id = ?", [productId]);
};

const deleteProductSizes = async (connection, productId) => {
    await connection.execute("DELETE FROM product_sizes WHERE product_id = ?", [productId]);
};

const updateStatus = async (id, status) => {
    const [result] = await db.execute(
        "UPDATE products SET product_status = ? WHERE id = ?",
        [status, id]
    );
    return result.affectedRows;
};

export default {
    countProducts,
    findProductsPaginated,
    findById,
    findImagesByProductId,
    findSizesByProductId,
    findLatest,
    insertProduct,
    insertProductImage,
    insertProductSize,
    updateProductBase,
    deleteProductImages,
    deleteProductSizes,
    updateStatus
};
