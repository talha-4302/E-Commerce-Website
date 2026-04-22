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
- `filters`: `{ category: [], subcategory: [], priceRange: {min: 0, max: 1000} }`
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
*   **`Filter.jsx` (or the filter sidebar):** Will pull `setFilters` and `setSortBy` from `ProductContext`.
*   **`Product.jsx` (Single Product Page):** Since it needs full details (all sizes, all images), we won't get it from the context array. Instead, we'll write a `useEffect` inside `Product.jsx` that calls `axios.get('/api/product/single/:id')` directly on mount.

---

## Tradeoff Discussion (Open Question for You)

> [!IMPORTANT]  
> **Question regarding single products:** 
> When a user clicks on a product to view its details (`Product.jsx`), we have two choices:
> 1. Find the product in the local `ProductContext.products` array and show it instantly.
> 2. Show a quick loader and fetch the fresh data directly from the backend via `/api/product/single/:id`.
> 
> **The Tradeoff:** Choice 1 is instant but might lack the extra images/sizes if our List API only brought back a thumbnail. Choice 2 takes 100ms longer but guarantees 100% fresh, complete data. 
> 
> Which approach do you prefer, and why?
