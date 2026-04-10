import { useState } from "react";
import { ShopContext } from "./ShopContext.js";
import { products } from "../assets/assets";

const ShopContextProvider = (props)=>{

    const currency ='$';
    const delivery_fee =10;

    const [filters, setFilters] = useState({
        category: [],
        subcategory: [],
        priceRange: { min: 0, max: 1000 }
    });

    const [sortBy, setSortBy] = useState('default');

    const [mobileFilterVisible, setMobileFilterVisible] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [cartItems, setCartItems] = useState([]);

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

    const value ={
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
        getProductById,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartItemCount,
        cartSubtotal,
    }
    return (
        <ShopContext.Provider value ={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
