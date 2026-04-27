import { useState, useEffect, useCallback, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductContext } from "./ProductContext.js";
import { AuthContext } from "./AuthContext.jsx";
import axios from "axios";

// ---------------------------------------------------------------
// ProductContext — The "Marketplace" Layer
//
// Responsible for:
//   1. Fetching the product catalog from the backend
//   2. Managing global filter & sort state for the catalog
//   3. Re-fetching whenever filters or sortBy change
//
// Pattern: Server-Driven Filtering
// Instead of fetching ALL products and filtering in JS,
// we send filter params to the backend and let MySQL do the work.
// This scales to thousands of products without slowing the browser.
// ---------------------------------------------------------------
const ProductContextProvider = (props) => {

    const { backendUrl } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';



    // --- Catalog State ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 12
    });

    // --- Filter State (drives the API query) ---
    const [filters, setFilters] = useState({
        category: [],
        subcategory: [],
        priceRange: { min: 0, max: 1000 }
    });

    const [sortBy, setSortBy] = useState('default');

    // ---------------------------------------------------------------
    // fetchProducts — Converts React state into URL query params
    // and hits GET /api/product/list
    // ---------------------------------------------------------------
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage);
            params.append('limit', 12);

            if (filters.category.length > 0) params.append('category', filters.category.join(','));
            if (filters.subcategory.length > 0) params.append('subCategory', filters.subcategory.join(','));
            if (filters.priceRange.min > 0) params.append('minPrice', filters.priceRange.min);
            if (filters.priceRange.max <= 1000) params.append('maxPrice', filters.priceRange.max);
            if (sortBy) params.append('sortBy', sortBy);
            if (searchQuery) params.append('search', searchQuery);

            const response = await axios.get(`${backendUrl}/api/product/list?${params.toString()}`);

            if (response.data.success) {
                const normalized = response.data.products.map(p => ({
                    ...p,
                    _id: p.id,
                    image: p.image ? [p.image] : [],
                }));
                setProducts(normalized);
                if (response.data.pagination) setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    }, [filters, sortBy, searchQuery, currentPage, backendUrl]);

    // 1. If filters/sort/search change → reset page to 1
    // If it's already 1, we must fetch manually because effect 2 won't fire
    useEffect(() => {
        if (currentPage === 1) {
            fetchProducts();
        } else {
            setCurrentPage(1);
        }
    }, [filters, sortBy, searchQuery]);

    // 2. Whenever currentPage changes → fetch
    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    // ---------------------------------------------------------------
    // Context Value
    // ---------------------------------------------------------------
    const value = {
        backendUrl,
        products,
        loading,
        filters,
        setFilters,
        sortBy,
        setSortBy,
        fetchProducts,
        currentPage,
        setCurrentPage,
        pagination
    };

    return (
        <ProductContext.Provider value={value}>
            {props.children}
        </ProductContext.Provider>
    );
};

export default ProductContextProvider;
