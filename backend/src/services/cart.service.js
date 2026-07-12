import cartRepository from '../repositories/cart.repository.js';
import AppError from '../utils/AppError.js';
import { PRODUCT_STATUS } from '../constants/index.js';

const addToCart = async (userId, { productId, size, quantity }) => {
    if (!productId || !size || !quantity) {
        throw new AppError("Missing required fields");
    }

    const product = await cartRepository.findProductStatus(productId);
    if (!product) throw new AppError("Product not found");

    if (product.product_status !== PRODUCT_STATUS.ACTIVE) {
        throw new AppError("This product is currently unavailable");
    }

    await cartRepository.upsertCartItem(userId, productId, size, quantity);
};

const updateCartItem = async (userId, { productId, size, quantity }) => {
    if (quantity <= 0) {
        await cartRepository.deleteCartItem(userId, productId, size);
        return { message: "Item removed from cart" };
    }

    await cartRepository.updateQuantity(userId, productId, size, quantity);
    return { message: "Cart updated" };
};

const removeFromCart = async (userId, { productId, size }) => {
    await cartRepository.deleteCartItem(userId, productId, size);
};

const getCart = async (userId) => {
    return cartRepository.findCartByUser(userId);
};

export default { addToCart, updateCartItem, removeFromCart, getCart };
