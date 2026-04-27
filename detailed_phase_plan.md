# Detailed Phase Plan — Pagination Implementation

> Each sub-phase is designed to be executed in a **single session** by Gemini Flash / 3.1 Pro.
> Each sub-phase modifies at most 2-3 files to stay within generation limits.
> Phases are ordered by dependency — complete them in order.

---

## Phase 1A: Create Reusable `<Pagination />` Component

**Files**: 1 NEW file
**Dependency**: None (can be done first)

### Task
Create `frontend/src/components/Pagination.jsx`

### Requirements
- Props: `currentPage` (number), `totalPages` (number), `onPageChange` (function)
- Show Previous / Next buttons, disabled at boundaries
- Show page numbers with a sliding window (always show first page, last page, current page ±1, ellipsis for gaps)
- Example: `« 1 ... 4 5 [6] 7 8 ... 20 »`
- On page change: call `onPageChange(newPage)` and scroll viewport to top via `window.scrollTo(0, 0)`
- If `totalPages <= 1`, render nothing (return `null`)
- Use Tailwind CSS classes matching the existing project style (gray/black color scheme)

### Verification
- Import the component into any existing page and test with hardcoded props like `currentPage={3} totalPages={10}` to verify the UI renders correctly before integrating real data.

---

## Phase 1B: Add Pagination to Product List Backend

**Files**: 1 MODIFY
**Dependency**: None (can be done in parallel with 1A)

### Task
Modify `backend/controllers/productController.js` — update `listProducts` function only.

### Current Behavior
- Accepts filter query params: `category`, `subCategory`, `minPrice`, `maxPrice`, `search`, `sortBy`
- Builds a dynamic `WHERE` clause with `conditions` string and `params` array
- Runs one query: `SELECT p.*, (image subquery) FROM products p ${conditions} ${orderBy}`
- Returns `{ success: true, products: rows }`

### Changes Required
1. **Extract `page` and `limit`** from `req.query` at the top (after destructuring). Default: `page = 1`, `limit = 12`. Parse as integers.
2. **Add a COUNT query** BEFORE the main query. It should reuse the SAME `conditions` and `params` but NOT include the image subquery or ORDER BY:
```sql
SELECT COUNT(*) AS total FROM products p ${conditions}
```
3. **Add LIMIT/OFFSET** to the main query:
```sql
${orderBy} LIMIT ? OFFSET ?
```
Where `OFFSET = (page - 1) * limit`. Push `limit` and `offset` into the params array AFTER the existing filter params.
4. **Update the response** to include pagination:
```javascript
const totalItems = countRows[0].total;
const totalPages = Math.ceil(totalItems / limit);

res.json({
    success: true,
    products: rows,
    pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit
    }
});
```

### Important
- The COUNT query needs its OWN copy of `params` (spread `[...params]`) because `db.execute` consumes the array. Don't share the same `params` reference between the two queries.
- Do NOT modify `getProductById` or `getLatestProducts`.

### Verification
Test with curl/browser:
- `GET /api/product/list` → should return 12 products + pagination object
- `GET /api/product/list?page=2` → should return next batch
- `GET /api/product/list?category=Men&page=1` → should return filtered + paginated results with correct totalItems

---

## Phase 2A: Integrate Pagination into ProductContext + Collection Page

**Files**: 2 MODIFY
**Dependency**: Phase 1A + 1B must be complete

### Task 1: Modify `frontend/src/context/ProductContext.jsx`

### Current Behavior
- State: `products`, `loading`, `filters`, `sortBy`
- `fetchProducts` (useCallback): builds URLSearchParams from filters/sort/search, calls `GET /api/product/list`, normalizes response into `products` state
- `useEffect` triggers `fetchProducts` whenever `fetchProducts` reference changes (which changes when deps change)

### Changes Required
1. **Add new state**:
```javascript
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 12 });
```
2. **Reset page to 1 when filters/sort/search change** — add a separate `useEffect`:
```javascript
useEffect(() => {
    setCurrentPage(1);
}, [filters, sortBy, searchQuery]);
```
3. **Update `fetchProducts`** — add `currentPage` to the useCallback dependencies, and add page/limit to params:
```javascript
params.append('page', currentPage);
params.append('limit', 12);
```
4. **Parse pagination from response**:
```javascript
if (response.data.success) {
    // ...existing normalization...
    setProducts(normalized);
    if (response.data.pagination) {
        setPagination(response.data.pagination);
    }
}
```
5. **Expose in context value**: Add `currentPage`, `setCurrentPage`, `pagination` to the value object.

### Task 2: Modify `frontend/src/pages/Collection.jsx`

### Changes Required
1. **Import** `Pagination` from `'../components/Pagination'`
2. **Consume from ProductContext**: add `currentPage`, `setCurrentPage`, `pagination` to the destructured context
3. **Render `<Pagination />`** below the product grid (after the `</div>` of the grid, before the closing `</div>` of the main content area):
```jsx
{!loading && pagination.totalPages > 1 && (
    <Pagination
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
    />
)}
```

### Verification
- Open Collection page → verify only 12 products show
- Click page 2 → new products load, scrolls to top
- Apply "Men" filter → page resets to 1, totalPages updates
- Change sort → page resets to 1

---

## Phase 2B: Add Pagination to User Orders (Backend + Frontend)

**Files**: 3 MODIFY
**Dependency**: Phase 1A must be complete

### Task 1: Modify `backend/controllers/orderController.js` — update `getUserOrders`

### Current Behavior
- Fetches ALL orders for a user: `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`
- Then batch-fetches ALL items for those orders
- Returns `{ success: true, orders: ordersData }`

### Changes Required
1. **Extract `page` and `limit`** from `req.query`. Default: `page = 1`, `limit = 10`. Parse as integers.
2. **Add COUNT query**:
```sql
SELECT COUNT(*) AS total FROM orders WHERE user_id = ?
```
3. **Add LIMIT/OFFSET** to the orders query:
```sql
SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?
```
4. The batch item-fetch stays the same — it only fetches items for the paginated slice of orders (which is already the correct behavior since `orderIds` comes from the paginated result).
5. **Update response** to include `pagination` alongside `orders`.

### Task 2: Modify `frontend/src/context/ShopContext.jsx` — update `fetchOrders`

### Current Behavior
```javascript
const fetchOrders = async () => {
    const response = await axios.get(backendUrl + '/api/order', { headers: ... });
    if (response.data.success) { return response.data.orders; }
    return [];
};
```

### Changes Required
Update `fetchOrders` to accept `page` and `limit` params, pass them as query params, and return both orders AND pagination:
```javascript
const fetchOrders = async (page = 1, limit = 10) => {
    if (!token) return { orders: [], pagination: null };
    try {
        const response = await axios.get(
            `${backendUrl}/api/order?page=${page}&limit=${limit}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
            return {
                orders: response.data.orders,
                pagination: response.data.pagination
            };
        }
        return { orders: [], pagination: null };
    } catch (error) {
        console.error("Fetch Orders Error", error);
        return { orders: [], pagination: null };
    }
};
```

### Task 3: Modify `frontend/src/pages/Orders.jsx`

### Current Behavior
- Calls `fetchOrders()` on mount, stores result in `orders` state
- Maps over `orders` array to render order cards

### Changes Required
1. **Import** `Pagination`
2. **Add state**: `const [currentPage, setCurrentPage] = useState(1)` and `const [pagination, setPagination] = useState(null)`
3. **Update `loadOrderData`**:
```javascript
const loadOrderData = async () => {
    setLoading(true);
    const result = await fetchOrders(currentPage, 10);
    setOrders(result.orders);
    setPagination(result.pagination);
    setLoading(false);
};
```
4. **Update `useEffect`** to re-fetch when `currentPage` changes:
```javascript
useEffect(() => { loadOrderData(); }, [currentPage]);
```
5. **Render `<Pagination />`** after the orders list.

### Verification
- Open Orders page → verify only 10 orders show (if user has more than 10)
- Click page 2 → next batch loads

---

## Phase 2C: Add Client-Side Pagination to Wishlist

**Files**: 1 MODIFY
**Dependency**: Phase 1A must be complete

### Task: Modify `frontend/src/pages/WishList.jsx`

### Current Behavior
- Reads `wishlistItems` from ShopContext
- Calls `filterWishlist()` to get filtered array
- Maps over `filteredWishlist` to render all items

### Changes Required
1. **Import** `Pagination` and add `useEffect` to imports
2. **Add state and constants**:
```javascript
const ITEMS_PER_PAGE = 10;
const [currentPage, setCurrentPage] = useState(1);
```
3. **Reset page when filters change** — add a `useEffect`:
```javascript
useEffect(() => {
    setCurrentPage(1);
}, [wishlistFilters]);
```
4. **Compute paginated slice** after `filterWishlist()`:
```javascript
const filteredWishlist = filterWishlist();
const totalPages = Math.ceil(filteredWishlist.length / ITEMS_PER_PAGE);
const paginatedWishlist = filteredWishlist.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
);
```
5. **Replace** `filteredWishlist.map(...)` with `paginatedWishlist.map(...)` in the JSX
6. **Update the empty state check**: change `filteredWishlist.length === 0` to check `filteredWishlist.length === 0` (keep as is — check the FULL filtered list, not the paginated slice)
7. **Render `<Pagination />`** after the wishlist items list

### Verification
- Add 15+ items to wishlist → verify only 10 show on page 1
- Click page 2 → remaining items show
- Apply a category filter → page resets to 1, pagination adjusts

---

## Phase 3A: Add Pagination to Admin Orders

**Files**: 2 MODIFY (1 backend + 1 frontend)
**Dependency**: Phase 1A must be complete

### Task 1: Modify `backend/controllers/admin/orderController.js` — update `getAllOrders`

### Current Behavior
- Optional status filter via `req.query.status`
- Fetches ALL matching orders with customer info
- Batch-fetches items for all orders

### Changes Required
1. **Extract `page` and `limit`** from `req.query`. Default: `page = 1`, `limit = 10`.
2. **Add COUNT query** using the same status filter condition:
```sql
-- If status filter is active:
SELECT COUNT(*) AS total FROM orders WHERE status = ?
-- If no filter:
SELECT COUNT(*) AS total FROM orders
```
3. **Add `LIMIT ? OFFSET ?`** to the main orders query (AFTER the ORDER BY).
4. Batch item-fetch stays the same (already scoped to paginated orderIds).
5. **Return `pagination` alongside `orders`**.

### Task 2: Modify `frontend/src/pages/admin/AdminOrders.jsx`

### Current Behavior
- `fetchOrders` builds path with optional `?status=` filter
- Calls `adminGet(backendUrl, adminToken, path)`
- `useEffect` triggers on `[filter, adminToken, backendUrl]`

### Changes Required
1. **Import** `Pagination`
2. **Add state**: `currentPage` (default 1), `pagination` (default null)
3. **Reset page when filter changes** — add to the existing `useEffect` deps or a separate effect:
```javascript
useEffect(() => { setCurrentPage(1); }, [filter]);
```
4. **Update `fetchOrders`** — append `page` and `limit` to the path:
```javascript
let path = '/api/admin/orders?page=' + currentPage + '&limit=10';
if (filter !== 'All') path += '&status=' + filter;
```
5. **Parse pagination from response**: `setPagination(data.pagination)`
6. **Update the main useEffect** to include `currentPage` in dependencies.
7. **Render `<Pagination />`** below the table (after the closing `</div>` of the table container).

### Verification
- Open Admin Orders → verify 10 orders show
- Change status filter → page resets to 1
- Navigate pages → data updates correctly

---

## Phase 3B: Add Pagination to Admin Users

**Files**: 2 MODIFY (1 backend + 1 frontend)
**Dependency**: Phase 1A must be complete

### Task 1: Modify `backend/controllers/admin/userController.js` — update `getAllUsers`

### Current Behavior
- Single query with `LEFT JOIN orders`, `GROUP BY`, returns all non-admin users with `order_count`

### Changes Required
1. **Extract `page` and `limit`** from `req.query`. Default: `page = 1`, `limit = 10`.
2. **Add a SEPARATE COUNT query** (no JOIN needed for counting):
```sql
SELECT COUNT(*) AS total FROM users WHERE role != 'admin'
```
3. **Add `LIMIT ? OFFSET ?`** to the MAIN data query (the one with the LEFT JOIN + GROUP BY). The main query is UNCHANGED except for adding LIMIT/OFFSET at the end.
4. **Return `pagination` alongside `users`**.

### Task 2: Modify `frontend/src/pages/admin/AdminUsers.jsx`

### Changes Required
1. **Import** `Pagination`
2. **Add state**: `currentPage` (default 1), `pagination` (default null)
3. **Update `fetchUsers`** — append `page` and `limit` to the path:
```javascript
const data = await adminGet(backendUrl, adminToken, `/api/admin/users?page=${currentPage}&limit=10`);
```
4. **Parse pagination**: `setPagination(data.pagination)`
5. **Update useEffect** to include `currentPage` in dependencies.
6. **Render `<Pagination />`** below the table.

### Verification
- Open Admin Users → verify 10 users show
- Navigate pages → data updates, order_count still visible per user

---

## Phase 3C: Add Pagination to Admin Products

**Files**: 1 MODIFY (frontend only — backend already done in Phase 1B)
**Dependency**: Phase 1A + 1B must be complete

### Task: Modify `frontend/src/pages/admin/AdminProducts.jsx`

### Current Behavior
- `fetchProducts` calls `adminGet(backendUrl, '', /api/product/list${params})`
- Has debounced search via `debouncedSearch`
- `useEffect` triggers on `[debouncedSearch, backendUrl]`

### Changes Required
1. **Import** `Pagination`
2. **Add state**: `currentPage` (default 1), `pagination` (default null)
3. **Reset page when search changes**:
```javascript
useEffect(() => { setCurrentPage(1); }, [debouncedSearch]);
```
4. **Update `fetchProducts`** — add `page` and `limit` to params:
```javascript
const params = new URLSearchParams();
if (debouncedSearch) params.append('search', debouncedSearch);
params.append('page', currentPage);
params.append('limit', 12);
const queryString = params.toString();
const data = await adminGet(backendUrl, '', `/api/product/list?${queryString}`);
```
5. **Parse pagination**: `if (data.pagination) setPagination(data.pagination)`
6. **Update the main useEffect** to include `currentPage` in dependencies.
7. **Render `<Pagination />`** below the product table/grid.

### Verification
- Open Admin Products → verify 12 products show
- Search "shirt" → page resets to 1, pagination adjusts
- Navigate pages → correct products load

---

## Execution Order Summary

| Order | Phase | Files Modified | Estimated Effort |
|-------|-------|---------------|-----------------|
| 1 | **1A** — Pagination Component | 1 new file | Small |
| 2 | **1B** — Product Backend | 1 file | Small |
| 3 | **2A** — ProductContext + Collection | 2 files | Medium |
| 4 | **2B** — User Orders (backend + frontend) | 3 files | Medium |
| 5 | **2C** — Wishlist Client-Side | 1 file | Small |
| 6 | **3A** — Admin Orders | 2 files | Medium |
| 7 | **3B** — Admin Users | 2 files | Small |
| 8 | **3C** — Admin Products | 1 file | Small |
