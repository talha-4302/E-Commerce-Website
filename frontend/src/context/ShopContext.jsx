import { createContext, useState } from "react";
import { products } from "../assets/assets";

export const ShopContext = createContext();

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
        getProductById
    }
    return (
        <ShopContext.Provider value ={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
