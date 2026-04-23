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
    //
    // useCallback ensures this function reference is stable,
    // so the useEffect below doesn't cause infinite loops.
    // ---------------------------------------------------------------
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Build query params from current filter state
            const params = new URLSearchParams();

            if (filters.category.length > 0) {
                params.append('category', filters.category.join(','));
            }
            if (filters.subcategory.length > 0) {
                params.append('subCategory', filters.subcategory.join(','));
            }
            if (filters.priceRange.min > 0) {
                params.append('minPrice', filters.priceRange.min);
            }
            if (filters.priceRange.max <= 1000) {
                params.append('maxPrice', filters.priceRange.max);
            }
            if (sortBy) {

                params.append('sortBy', sortBy);
            }

            if (searchQuery) {
                params.append('search', searchQuery);
            }


            const queryString = params.toString();
            const url = `${backendUrl}/api/product/list${queryString ? '?' + queryString : ''}`;

            const response = await axios.get(url);

            if (response.data.success) {
                // Normalize: backend returns `image` as a single URL string.
                // Our frontend expects `image` to be an array (for ProductCard).
                const normalized = response.data.products.map(p => ({
                    ...p,
                    _id: p.id,  // Backend uses `id`, frontend expects `_id`
                    image: p.image ? [p.image] : [],
                }));
                setProducts(normalized);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    }, [filters, sortBy, searchQuery, backendUrl]);

    // ---------------------------------------------------------------
    // Auto-fetch: whenever filters or sortBy change, re-query the DB
    // ---------------------------------------------------------------
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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
    };

    return (
        <ProductContext.Provider value={value}>
            {props.children}
        </ProductContext.Provider>
    );
};

export default ProductContextProvider;
