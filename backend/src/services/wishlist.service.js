import wishlistRepository from '../repositories/wishlist.repository.js';
import AppError from '../utils/AppError.js';

const getWishlist = async (userId) => {
    const wishlistItems = await wishlistRepository.findWishlistByUser(userId);
    if (wishlistItems.length === 0) return [];

    const productIds = wishlistItems.map((item) => item.id);
    const sizeRows = await wishlistRepository.findSizesForProducts(productIds);

    return wishlistItems.map((item) => ({
        ...item,
        sizes: sizeRows.filter((row) => row.product_id === item.id).map((row) => row.size)
    }));
};

const addToWishlist = async (userId, productId) => {
    if (!productId) throw new AppError("Missing product ID");
    await wishlistRepository.insertIgnore(userId, productId);
};

const removeFromWishlist = async (userId, productId) => {
    await wishlistRepository.deleteItem(userId, productId);
};

export default { getWishlist, addToWishlist, removeFromWishlist };
