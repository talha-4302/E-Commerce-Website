import wishlistService from '../services/wishlist.service.js';
import catchAsync from '../utils/catchAsync.js';

const getWishlist = catchAsync(async (req, res) => {
    const wishlistData = await wishlistService.getWishlist(req.userId);
    res.json({ success: true, wishlistData });
});

const addToWishlist = catchAsync(async (req, res) => {
    await wishlistService.addToWishlist(req.userId, req.body.productId);
    res.json({ success: true, message: "Added to wishlist" });
});

const removeFromWishlist = catchAsync(async (req, res) => {
    await wishlistService.removeFromWishlist(req.userId, req.body.productId);
    res.json({ success: true, message: "Removed from wishlist" });
});

export { getWishlist, addToWishlist, removeFromWishlist };
