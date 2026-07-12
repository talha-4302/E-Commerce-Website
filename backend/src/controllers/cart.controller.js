import cartService from '../services/cart.service.js';
import catchAsync from '../utils/catchAsync.js';

const addToCart = catchAsync(async (req, res) => {
    await cartService.addToCart(req.userId, req.body);
    res.json({ success: true, message: "Added to cart" });
});

const updateCartItem = catchAsync(async (req, res) => {
    const { message } = await cartService.updateCartItem(req.userId, req.body);
    res.json({ success: true, message });
});

const removeFromCart = catchAsync(async (req, res) => {
    await cartService.removeFromCart(req.userId, req.body);
    res.json({ success: true, message: "Removed from cart" });
});

const getCart = catchAsync(async (req, res) => {
    const cartData = await cartService.getCart(req.userId);
    res.json({ success: true, cartData });
});

export { addToCart, updateCartItem, removeFromCart, getCart };
