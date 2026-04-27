# Pagination Implementation Plan (v2 — Reviewed & Fixed)

This document outlines the strategy for implementing pagination across the user frontend and admin frontend.

## Decisions Confirmed

- ✅ **Skip Cart pagination** — carts are small, user needs full visibility before checkout.
- ✅ **Client-Side pagination for Wishlist** — data is already in ShopContext memory.
- ✅ **Server-Side pagination (SQL LIMIT/OFFSET) for everything else** — Products, Orders, Users.
- ✅ **12 items/page** for products, **10 items/page** for lists (orders, users).

## Key Architectural Principle

> [!IMPORTANT]
> **Filters + Pagination work TOGETHER, not separately.**
>
> Pagination always applies to the **filtered** result set. When a user filters by "Men" category and there are 20 matching products, they see 2 pages of 12 — NOT all 20 at once. The SQL `COUNT(*)` also counts only filtered rows, so `totalPages` always reflects the current filter state.
>
> This means: when any filter, sort, or search changes → `currentPage` must reset to 1.

## API Response Contract

> [!WARNING]
> **Keep existing response keys** — do NOT change to a generic `"data"` key. Each endpoint keeps its existing key (`products`, `orders`, `users`) and ADDS a `pagination` object alongside it.

**Why keep existing keys?** The frontend already reads data using specific keys like `response.data.products`, `data.orders`, `data.users`. If we changed the backend to return a generic `"data"` key, every single frontend reference would break. Instead, we make a **non-breaking change** — keep the existing key and just ADD a `pagination` object next to it. The frontend only needs new code to read `pagination`, no rewrites.

```json
{
  "success": true,
  "products": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "limit": 12
  }
}
```

---

### Phase 1: Foundation (UI Component & Core Catalog API)

#### [NEW] `frontend/src/components/Pagination.jsx`
- Create a reusable React component accepting `currentPage`, `totalPages`, `onPageChange` props.
- Sliding window of page numbers (e.g., `1 ... 4 5 [6] 7 8 ... 20`).
- **Scroll-to-top**: On page change, scroll the viewport to the top of the list so the user doesn't land at the bottom where the controls are.
- Disable prev/next buttons at boundaries.
- Accepts an optional `scrollTargetRef` prop for scroll-to-top behavior, so each page can control where it scrolls to.

#### [MODIFY] `backend/controllers/productController.js`
- Update `listProducts` to accept `page` (default: 1) and `limit` (default: 12) query params.
- Add a **separate** `COUNT(*)` query that reuses the same dynamic `WHERE` conditions but skips the image subquery and `ORDER BY` (for performance).
- Append `LIMIT ? OFFSET ?` to the main data query (where `OFFSET = (page - 1) * limit`).
- Return the `pagination` object alongside the existing `products` array.

---

### Phase 2: User Frontend Integration

#### [MODIFY] `frontend/src/context/ProductContext.jsx`
- Add `currentPage` and `pagination` state.
- Update `fetchProducts` to include `page` and `limit` in query params.
- Parse `pagination` from response and store it.
- **Reset `currentPage` to 1 whenever `filters`, `sortBy`, or `searchQuery` changes** — all three, not just filters. This prevents stale page numbers when switching contexts.
- **Double-fetch prevention**: Use a single `useEffect` that depends on `[filters, sortBy, searchQuery, currentPage]`. Reset the page in a separate `useEffect` that only watches `[filters, sortBy, searchQuery]` and sets `currentPage = 1` without directly triggering a fetch. The fetch fires naturally when `currentPage` updates.
- Expose `currentPage`, `setCurrentPage`, and `pagination` through the context value.

#### [MODIFY] `frontend/src/pages/Collection.jsx`
- Consume `currentPage`, `setCurrentPage`, `pagination` from `ProductContext`.
- Render `<Pagination />` below the product grid.

#### [MODIFY] `backend/controllers/orderController.js`
- Update `getUserOrders` to accept `page` and `limit` query params.
- Add `COUNT(*)` query on the `orders` table (WHERE `user_id = ?`).
- Add `LIMIT ? OFFSET ?` to the orders query.
- Batch-fetch order items only for the paginated slice of orders (not all orders), which is actually more efficient than before.

#### [MODIFY] `frontend/src/context/ShopContext.jsx`
- Update `fetchOrders` signature to accept `page` and `limit` arguments.
- Return both `orders` data AND `pagination` metadata to the caller.

#### [MODIFY] `frontend/src/pages/Orders.jsx`
- Add local `currentPage` and `pagination` state.
- Call `fetchOrders(currentPage, 10)` in the `useEffect`.
- Re-fetch when `currentPage` changes.
- Render `<Pagination />`.

#### [MODIFY] `frontend/src/pages/WishList.jsx`
- Implement **Client-Side** pagination on the `filteredWishlist` array.
- Local `currentPage` state, calculate `totalPages = Math.ceil(filteredWishlist.length / ITEMS_PER_PAGE)`.
- Slice: `filteredWishlist.slice((currentPage - 1) * limit, currentPage * limit)`.
- **Reset `currentPage` to 1 when `wishlistFilters` change** (same principle as ProductContext).
- Render `<Pagination />`.

---

### Phase 3: Admin Frontend Integration

#### [MODIFY] `backend/controllers/admin/orderController.js`
- Add `page` and `limit` query params to `getAllOrders`.
- `COUNT(*)` query with the same status filter condition.
- `LIMIT ? OFFSET ?` on the main query.
- Batch-fetch items only for the paginated orders.

#### [MODIFY] `backend/controllers/admin/userController.js`
- Add `page` and `limit` query params to `getAllUsers`.
- **Two separate queries**: The **main data query** is unchanged — it still uses `LEFT JOIN orders` + `GROUP BY` to get `order_count` per user, but now with `LIMIT ? OFFSET ?` appended. A **separate pagination COUNT query** uses `SELECT COUNT(*) FROM users WHERE role != 'admin'` — this one skips the JOIN because it only needs the total user count (not order_count) for calculating `totalPages`.

#### [MODIFY] `frontend/src/pages/admin/AdminProducts.jsx`
- Add local `currentPage` and `pagination` state.
- Send `page` alongside the debounced search to `/api/product/list`.
- **Reset `currentPage` to 1 when `debouncedSearch` changes** (search results should start at page 1).
- Render `<Pagination />`.

#### [MODIFY] `frontend/src/pages/admin/AdminOrders.jsx`
- Add local `currentPage` and `pagination` state.
- Send `page` to `/api/admin/orders`.
- **Reset `currentPage` to 1 when the status filter changes.**
- Render `<Pagination />`.

#### [MODIFY] `frontend/src/pages/admin/AdminUsers.jsx`
- Add local `currentPage` and `pagination` state.
- Send `page` to `/api/admin/users`.
- Render `<Pagination />`.

---

### Edge Cases to Handle

> [!NOTE]
> **Out-of-range page after deletion**: If admin is on page 5 and deletes items so only 4 pages remain, the API returns 0 items for page 5. The frontend should detect this — if the response has `items.length === 0` but `pagination.totalItems > 0`, auto-navigate to `pagination.totalPages` (the last valid page). This logic can live in the `<Pagination />` component or in each page's fetch handler.

---

## Verification Plan

### Manual Verification
1. **Filters + Pagination (Collection)**: Apply "Men" filter → verify page count reflects filtered total. Navigate to page 2 → verify correct products. Change sort to "Price Low to High" → verify page resets to 1.
2. **Search + Pagination**: Search "shirt" → verify page 1 of search results. Navigate to page 2 → verify correct results. Clear search → verify full catalog resets to page 1.
3. **Wishlist Client-Side**: Add 15+ items. Apply a category filter → verify pagination adjusts. Remove filter → verify pagination adjusts back.
4. **Admin Deletion Edge Case**: Navigate to the last page of admin products. Delete items until the page should no longer exist. Verify auto-redirect to last valid page.
5. **Scroll Behavior**: Click page 2 on any paginated view → verify viewport scrolls to top of list, not stuck at bottom.
