import { useState, useEffect, useContext } from "react";
import { ShopContext } from "./ShopContext.js";
import { AuthContext } from "./AuthContext.jsx";
import { toast } from "react-toastify";

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

    const { backendUrl } = useContext(AuthContext);
    const currency = '$';
    const delivery_fee = 10;


    // --- UI State ---
    const [mobileFilterVisible, setMobileFilterVisible] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    // --- Cart State ---
    const [cartItems, setCartItems] = useState([]);

    // --- Wishlist State (Sync to LocalStorage) ---
    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // --- Wishlist Local Filtering ---
    // This allows users to filter their personal wishlist without 
    // affecting the main store catalog.
    const [wishlistFilters, setWishlistFilters] = useState({
        category: [],
        subcategory: [],
        priceRange: { min: 0, max: 1000 }
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    // --- Cart Logic ---
    const addToCart = (product, size = null, quantity = 1) => {
        const selectedSize = size || product.sizes?.[0] || null;
        setCartItems(prevItems => {
            const existingIndex = prevItems.findIndex(
                item => item._id === product._id && item.size === selectedSize
            );

            if (existingIndex >= 0) {
                const updated = [...prevItems];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                };
                return updated;
            }

            return [
                ...prevItems,
                {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size: selectedSize,
                    quantity,
                },
            ];
        });
        toast.success('Added to cart', {
            autoClose: 1500
        });
    };

    const removeFromCart = (productId, size = null) => {
        setCartItems(prevItems => prevItems.filter(item => !(item._id === productId && item.size === size)));
    };

    const updateCartItemQuantity = (productId, size, newQuantity) => {
        setCartItems(prevItems => prevItems.flatMap(item => {
            if (item._id !== productId || item.size !== size) return item;
            if (newQuantity <= 0) return [];
            return { ...item, quantity: newQuantity };
        }));
    };

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const clearCart = () => {
        setCartItems([]);
    };

    // --- Wishlist Logic ---
    const addToWishlist = (product) => {
        setWishlistItems(prevItems => {
            const exists = prevItems.find(item => item._id === product._id);
            if (exists) return prevItems;
            return [
                ...prevItems,
                {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    description: product.description,
                    category: product.category,
                    subCategory: product.subCategory,
                    sizes: product.sizes,
                },
            ];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
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

    const value = {
        currency,
        delivery_fee,
        backendUrl,
        
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
    }
    
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;

