import db from '../config/database.js';
import productRepository from '../repositories/product.repository.js';
import AppError from '../utils/AppError.js';
import { PRODUCT_STATUS } from '../constants/index.js';

// turn a comma-separated string into a clean array, e.g. "Men,Women" -> ["Men", "Women"]
const toArray = (value) => {
    if (!value) return [];
    return value.split(",").map((v) => v.trim()).filter(Boolean);
};

const listProducts = async (query) => {
    const { category, subCategory, minPrice, maxPrice, search, sortBy, status } = query;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const offset = (page - 1) * limit;

    const filters = {
        category: toArray(category),
        subCategory: toArray(subCategory),
        minPrice,
        maxPrice,
        search,
        status
    };

    const totalItems = await productRepository.countProducts(filters);
    const totalPages = Math.ceil(totalItems / limit);

    // Pick from a safe whitelist, never inject user input directly.
    let orderBy = "ORDER BY p.id "; // default: newest first
    if (sortBy === "price_asc") orderBy = "ORDER BY p.price ASC";
    else if (sortBy === "price_desc") orderBy = "ORDER BY p.price DESC";
    else if (sortBy === "newest") orderBy = "ORDER BY p.created_at DESC";

    const products = await productRepository.findProductsPaginated(filters, orderBy, limit, offset);

    return { products, pagination: { currentPage: page, totalPages, totalItems, limit } };
};

const getProductById = async (id) => {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError("Product not found");

    product.images = await productRepository.findImagesByProductId(id);
    product.sizes = await productRepository.findSizesByProductId(id);

    return product;
};

const getLatestProducts = async () => {
    return productRepository.findLatest();
};

// --- admin ---

const addProduct = async ({ name, description, price, category, subCategory, sizes, bestSeller, images }) => {
    if (!name || !price || !description || !images || images.length === 0) {
        throw new AppError("Missing required fields");
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const productId = await productRepository.insertProduct(connection, {
            name, description, price, category, subCategory, bestSeller
        });

        const cleanImages = images.slice(0, 4);
        for (const imageUrl of cleanImages) {
            if (imageUrl.trim()) {
                await productRepository.insertProductImage(connection, productId, imageUrl.trim());
            }
        }

        if (sizes && sizes.length > 0) {
            for (const size of sizes) {
                await productRepository.insertProductSize(connection, productId, size);
            }
        }

        await connection.commit();
        return productId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const updateProduct = async (id, { name, description, price, category, subCategory, sizes, bestSeller, images }) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const affectedRows = await productRepository.updateProductBase(connection, id, {
            name, description, price, category, subCategory, bestSeller
        });

        if (affectedRows === 0) {
            throw new AppError("Product not found");
        }

        // Replace approach: delete and re-insert
        await productRepository.deleteProductImages(connection, id);
        const cleanImages = images.slice(0, 4);
        for (const imageUrl of cleanImages) {
            if (imageUrl.trim()) {
                await productRepository.insertProductImage(connection, id, imageUrl.trim());
            }
        }

        await productRepository.deleteProductSizes(connection, id);
        if (sizes && sizes.length > 0) {
            for (const size of sizes) {
                await productRepository.insertProductSize(connection, id, size);
            }
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const updateProductStatus = async (id, status) => {
    const allowedStatuses = Object.values(PRODUCT_STATUS);
    if (!allowedStatuses.includes(status)) {
        throw new AppError("Invalid status value");
    }

    const affectedRows = await productRepository.updateStatus(id, status);
    if (affectedRows === 0) {
        throw new AppError("Product not found");
    }
};

export default {
    listProducts,
    getProductById,
    getLatestProducts,
    addProduct,
    updateProduct,
    updateProductStatus
};
