import { useState, useEffect } from "react";
import { ShopContext } from "./ShopContext.js";
import { products } from "../assets/assets";
import { toast } from "react-toastify";

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;

    const [filters, setFilters] = useState({
        category: [],
        subcategory: [],
        priceRange: { min: 0, max: 1000 }
    });

    const [sortBy, setSortBy] = useState('default');

    const [mobileFilterVisible, setMobileFilterVisible] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    const backendUrl = "http://localhost:5000";

    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState(() => {
        try {
            const saved = localStorage.getItem('wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const filterProducts = () => {
        let filtered = products;

        if (filters.category.length > 0) {
            filtered = filtered.filter(product => filters.category.includes(product.category));
        }

        if (filters.subcategory.length > 0) {
            filtered = filtered.filter(product => filters.subcategory.includes(product.subCategory));
        }

        filtered = filtered.filter(product => product.price >= filters.priceRange.min && product.price <= filters.priceRange.max);

        return filtered;
    };

    const sortProducts = (products) => {
        if (sortBy === 'date') {
            return [...products].sort((a, b) => b.date - a.date);
        }
        return products;
    };

    const filteredAndSortedProducts = sortProducts(filterProducts());

    const getProductById = (id) => {
        return products.find(product => product._id === id);
    };

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

        if (filters.category.length > 0) {
            filtered = filtered.filter(item => filters.category.includes(item.category));
        }

        if (filters.subcategory.length > 0) {
            filtered = filtered.filter(item => filters.subcategory.includes(item.subCategory));
        }

        filtered = filtered.filter(item => item.price >= filters.priceRange.min && item.price <= filters.priceRange.max);

        return filtered;
    };

    const wishlistItemCount = wishlistItems.length;

    const value = {
        products: filteredAndSortedProducts,
        currency,
        delivery_fee,
        filters,
        setFilters,
        sortBy,
        setSortBy,
        mobileFilterVisible,
        setMobileFilterVisible,
        mobileMenuVisible,
        setMobileMenuVisible,

        backendUrl,
        getProductById,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartItemCount,
        cartSubtotal,
        clearCart,
        wishlistItems,
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
