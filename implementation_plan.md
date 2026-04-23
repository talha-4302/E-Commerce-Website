# Implementation Plan — Phase 2: Frontend Context Refactor

## Goal
Implement the **Clean Context Architecture**. We are taking the massive `ShopContext` and breaking it in half using the Single Responsibility Principle. 

1. `ProductContext` will talk to our new Node/MySQL backend.
2. `ShopContext` will strictly handle the user's shopping session (Cart/Wishlist).

---

## 1. Create `ProductContext.jsx` (The "What we are selling" layer)
**Path:** `frontend/src/context/ProductContext.jsx`

This new context will completely take over fetching, filtering, and sorting products.
It will replace the static `products` array with an Axios call to our new `/api/product/list` endpoint.

**State to Manage:**
- `products`: `[]` (Array of objects from backend)
- `loading`: `false` (For showing a spinner while fetching)
- `filters`: `{ category: [], subcategory: [], priceRange: {min: 0, max: 1000} }` (State to drive the UI and API calls)
- `setFilters`: (Updater function for components like `Filter.jsx`)
- `sortBy`: `'default'`

**Key Function:** `fetchProducts()`
- We will write a `useEffect` that watches the `filters` and `sortBy` state.
- When they change, it will use `axios` to hit `http://localhost:4000/api/product/list`.
- It will convert the React filter state into URL Query Parameters (e.g., `?category=Men,Women&minPrice=0&maxPrice=1000`).

---

## 2. Strip Down `ShopContext.jsx` (The "What the user is buying" layer)
**Path:** `frontend/src/context/ShopContext.jsx`

We will aggressively delete code from this file to clean it up.

**What we will DELETE:**
- The `products` import from `assets.js`
- `filters` and `setFilters`
- `sortBy` and `setSortBy`
- `filterProducts()` and `sortProducts()`
- `filteredAndSortedProducts`

**What we will KEEP:**
- `cartItems` and all cart logic (`addToCart`, `removeFromCart`, `clearCart`, etc.)
- `wishlistItems` and all wishlist logic
- `currency` and `delivery_fee`

> [!NOTE]
> Currently, your `addToCart` and `addToWishlist` functions clone the product data (name, price, image) directly into the state. This means `ShopContext` actually doesn't *need* access to the main products array anymore once the item is added. It is completely decoupled!
> 
> **Wishlist Filtering Note:** If the Wishlist page needs filters, we should avoid using the global `ProductContext.filters` (which are for the whole catalog). Instead, we can implement a simple frontend filter on the `wishlistItems` array directly in the `Wishlist.jsx` page component to keep the discovery experience and personal wishlist experience separate.

---

## 3. Wire it all together
**Path:** `frontend/src/main.jsx`

We will wrap the app in the new provider so both Contexts are available everywhere:
```jsx
<AuthContextProvider>
    <ProductContextProvider>     {/* <-- NEW */}
        <ShopContextProvider>
            <App />
        </ShopContextProvider>
    </ProductContextProvider>
</AuthContextProvider>
```

---

## 4. Refactor the Pages
We need to go through the pages and point them to the correct context.

*   **`Collection.jsx` & `Home.jsx`:** Instead of getting `products` from `ShopContext`, they will now do: `const { products, loading } = useContext(ProductContext);`
*   **`Filter.jsx` (or the filter sidebar):** Will pull `filters`, `setFilters`, and `setSortBy` from `ProductContext`. This ensures the UI stays in sync with the current active filters.
*   **`Product.jsx` (Single Product Page):** We have confirmed **Choice 2 (Backend Fetch)**. Since it needs full details (all sizes, all images), we won't get it from the context array. Instead, we'll write a `useEffect` inside `Product.jsx` that calls `axios.get('/api/product/single/:id')` directly on mount. This ensures 100% data freshness even if the product was filtered out of the main list in another tab.

---

## Tradeoff Discussion (Open Question for You)

> [!IMPORTANT]  
> **Question regarding single products: RESOLVED (Choice 2)** 
> We decided to fetch fresh data directly from the backend via `/api/product/single/:id`.
> 
> **The Rationale:** 
> 1. **Data Completeness:** The list API might only return thumbnails. The single API returns the full object (all images, full description, specific stock/sizes).
> 2. **Consistency:** If a user filters the products in one tab, the local `products` array changes. If they are viewing a product in another tab, we don't want the UI to break just because that product "disappeared" from the filtered list. The detail page should be its own source of truth.
