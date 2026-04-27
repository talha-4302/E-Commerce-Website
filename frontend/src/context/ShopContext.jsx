import { useState, useEffect, useContext } from "react";
import { ShopContext } from "./ShopContext.js";
import { AuthContext } from "./AuthContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

// ---------------------------------------------------------------
// ShopContext — The "Session" Layer
//
// Responsible for:
//   1. User's Shopping Cart (in-memory)
//   2. User's Wishlist (synced to LocalStorage)
//   3. Shared UI state (mobile menu, currency settings)
//
// Pattern: Single Responsibility Principle
// We removed all product catalog logic to ProductContext.
// This context now ONLY cares about the user's interaction.
// ---------------------------------------------------------------
const ShopContextProvider = (props) => {

    const { backendUrl, token } = useContext(AuthContext);
    const currency = '$';
    const delivery_fee = 10;


    // --- UI State ---
    const [mobileFilterVisible, setMobileFilterVisible] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    // --- Cart State ---
    const [cartItems, setCartItems] = useState([]);

    // --- Wishlist State ---
    const [wishlistItems, setWishlistItems] = useState([]);

    // --- Wishlist Local Filtering ---
    const [wishlistFilters, setWishlistFilters] = useState({
        category: [],
        subcategory: [],
        priceRange: { min: 0, max: 1000 }
    });

    // --- API Fetching ---

    const fetchCart = async () => {
        if (!token) return;
        try {
            const response = await axios.get(backendUrl + '/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                // Normalize for frontend: backend id -> _id, image string -> [image]
                const normalized = response.data.cartData.map(item => ({
                    ...item,
                    _id: item.id,
                    image: item.image ? [item.image] : []
                }));
                setCartItems(normalized);
            }
        } catch (error) {
            console.error("Fetch Cart Error", error);
        }
    };

    const fetchWishlist = async () => {
        if (!token) return;
        try {
            const response = await axios.get(backendUrl + '/api/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                // Normalize for frontend: backend id -> _id, image string -> [image]
                const normalized = response.data.wishlistData.map(item => ({
                    ...item,
                    _id: item.id,
                    image: item.image ? [item.image] : []
                }));
                setWishlistItems(normalized);
            }
        } catch (error) {
            console.error("Fetch Wishlist Error", error);
        }
    };

    const fetchOrders = async () => {
        if (!token) return [];
        try {
            const response = await axios.get(backendUrl + '/api/order', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                return response.data.orders;
            }
            return [];
        } catch (error) {
            console.error("Fetch Orders Error", error);
            return [];
        }
    };

    useEffect(() => {
        if (token) {
            fetchCart();
            fetchWishlist();
        } else {
            setCartItems([]);
            setWishlistItems([]);
        }
    }, [token]);

    // --- Cart Logic ---
    const addToCart = async (product, size = null, quantity = 1) => {
        const selectedSize = size || product.sizes?.[0] || null;

        if (token) {
            try {
                const response = await axios.post(backendUrl + '/api/cart/add',
                    { productId: product._id, size: selectedSize, quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    toast.success('Added to cart', { autoClose: 1000 });
                    fetchCart();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Add to Cart Error", error);
                toast.error(error.message);
            }
        } else {
            toast.error("Please log in first");
        }
    };

    const removeFromCart = async (productId, size = null) => {
        if (token) {
            try {
                const response = await axios.post(backendUrl + '/api/cart/remove',
                    { productId, size },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    fetchCart();
                }
            } catch (error) {
                console.error("Remove from Cart Error", error);
            }
        }
    };

    const updateCartItemQuantity = async (productId, size, newQuantity) => {
        if (token) {
            try {
                const response = await axios.put(backendUrl + '/api/cart/update',
                    { productId, size, quantity: newQuantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    fetchCart();
                }
            } catch (error) {
                console.error("Update Cart Quantity Error", error);
            }
        }
    };

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const clearCart = () => {
        setCartItems([]);
    };

    // --- Wishlist Logic ---
    const addToWishlist = async (product) => {
        if (token) {
            try {
                const response = await axios.post(backendUrl + '/api/wishlist/add',
                    { productId: product._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    toast.success('Added to wishlist', { autoClose: 1500 });
                    fetchWishlist();
                }
            } catch (error) {
                console.error("Add to Wishlist Error", error);
            }
        } else {
            toast.error("Please log in first");
        }
    };

    const removeFromWishlist = async (productId) => {
        if (token) {
            try {
                const response = await axios.post(backendUrl + '/api/wishlist/remove',
                    { productId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    fetchWishlist();
                }
            } catch (error) {
                console.error("Remove from Wishlist Error", error);
            }
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    const filterWishlist = () => {
        let filtered = wishlistItems;

        if (wishlistFilters.category.length > 0) {
            filtered = filtered.filter(item => wishlistFilters.category.includes(item.category));
        }

        if (wishlistFilters.subcategory.length > 0) {
            filtered = filtered.filter(item => wishlistFilters.subcategory.includes(item.subCategory));
        }

        filtered = filtered.filter(item => item.price >= wishlistFilters.priceRange.min && item.price <= wishlistFilters.priceRange.max);

        return filtered;
    };

    const wishlistItemCount = wishlistItems.length;

    const placeOrder = async (shippingAddress, paymentMethod, totalAmount) => {
        if (!token) return { success: false, message: "Please log in" };
        try {
            const response = await axios.post(backendUrl + '/api/order/place',
                { shippingAddress, paymentMethod, totalAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setCartItems([]); // Local clear
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error("Place Order Error", error);
            return { success: false, message: error.message };
        }
    };


    const value = {
        currency,
        delivery_fee,
        backendUrl,
        token,

        // UI
        mobileFilterVisible,
        setMobileFilterVisible,
        mobileMenuVisible,
        setMobileMenuVisible,

        // Cart
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartItemCount,
        cartSubtotal,
        clearCart,

        // Wishlist
        wishlistItems,
        wishlistFilters,
        setWishlistFilters,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        filterWishlist,
        wishlistItemCount,

        // Orders
        placeOrder,
        fetchOrders,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}


export default ShopContextProvider;

