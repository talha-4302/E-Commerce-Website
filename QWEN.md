# EZSHOP - E-Commerce Frontend

## Project Overview

**EZSHOP** is a modern e-commerce frontend application built with **React 19** and **Vite 8**. The application provides a complete online shopping experience with product browsing, filtering, cart management, wishlist, and checkout functionality.

### Key Features
- **Product Catalog**: 52 products across 3 categories (Men, Women, Kids) and 3 subcategories (Topwear, Bottomwear, Winterwear)
- **Advanced Filtering**: Filter by category, subcategory, and price range ($0–$1000); sort by newest arrivals
- **Shopping Cart**: Add/remove products, manage quantities, size selection, subtotal + delivery fee calculation
- **Wishlist**: Add/remove products, persisted to localStorage, filterable, dedicated page at `/wishlist`
- **Search Functionality**: SearchBar filters collection by product name, description, category, subcategory
- **Product Detail Page**: Image gallery with thumbnails, size selector, dummy reviews, related products
- **Responsive Design**: Mobile-first with sidebar navigation and collapsible filter panel for small screens
- **User Authentication UI**: Login and signup pages (UI only, no backend)
- **Checkout Flow**: PlaceOrder route exists but page is empty (not implemented yet)

### Tech Stack
- **Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.4
- **Styling**: Tailwind CSS 4.2.2
- **Routing**: React Router DOM 7.14.0
- **Notifications**: React Toastify 11.0.5
- **Fonts**: Google Fonts (Outfit for body, Prata for decorative headings)

## Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── assets/              # Product images (p_img1.png – p_img52.png), icons, logos
│   │   │   └── assets.js        # Centralized asset exports + 52 static product definitions
│   │   ├── components/          # Reusable UI components
│   │   │   ├── FeatureSection.jsx    # Features showcase (quality, exchange, support)
│   │   │   ├── Filter.jsx            # Category, subcategory, price range filters (mobile + desktop)
│   │   │   ├── Footer.jsx            # Site footer
│   │   │   ├── Hero.jsx              # Hero banner section
│   │   │   ├── LatestCollection.jsx  # Latest products grid on home page
│   │   │   ├── Navbar.jsx            # Top navigation with links, cart/wishlist icons, profile dropdown, mobile menu
│   │   │   ├── NewsletterSection.jsx # Newsletter signup section
│   │   │   ├── ProductCard.jsx       # Product card used in grids
│   │   │   ├── SearchBar.jsx         # Toggleable search input
│   │   │   └── Title.jsx             # Section title component
│   │   ├── context/             # React Context for global state
│   │   │   ├── ShopContext.js        # Context creation (createContext)
│   │   │   └── ShopContext.jsx       # ShopContextProvider with all state logic
│   │   ├── pages/               # Route-based page components
│   │   │   ├── About.jsx             # About page
│   │   │   ├── Cart.jsx              # Shopping cart with quantity controls and totals
│   │   │   ├── Collection.jsx        # Full product catalog with filters and sorting
│   │   │   ├── Contact.jsx           # Contact page
│   │   │   ├── Home.jsx              # Landing page (Hero + LatestCollection + Features + Newsletter)
│   │   │   ├── Login.jsx             # Legacy login page
│   │   │   ├── Orders.jsx            # Order history page
│   │   │   ├── PlaceOrder.jsx        # Checkout page (EMPTY - not implemented)
│   │   │   ├── Product.jsx           # Single product detail with gallery, size selector, reviews, related products
│   │   │   ├── UserLogin.jsx         # User login page
│   │   │   ├── UserSignup.jsx        # User registration page
│   │   │   └── WishList.jsx          # Wishlist page with filter support
│   │   ├── App.jsx              # Main app: routes + Navbar + SearchBar + Footer
│   │   ├── index.css            # Global styles, Tailwind imports, font definitions
│   │   └── main.jsx             # Entry point: BrowserRouter > ShopContextProvider > App
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite config with @tailwindcss/vite plugin
│   ├── package.json             # Dependencies and scripts
│   └── eslint.config.js         # ESLint configuration
├── .qwen/
│   └── PROJECT_SUMMARY.md       # Session summary for AI context
└── QWEN.md                      # This file
```

## State Management (ShopContext)

The application uses **React Context** (`ShopContext`) for global state management. Provider is `ShopContextProvider` in `context/ShopContext.jsx`.

### State Variables
| State | Type | Persisted | Description |
|-------|------|-----------|-------------|
| `filters` | `{ category: [], subcategory: [], priceRange: { min, max } }` | No | Active filter selections |
| `sortBy` | `'default' \| 'date'` | No | Sort mode (newest arrivals) |
| `mobileFilterVisible` | `boolean` | No | Mobile filter panel visibility |
| `mobileMenuVisible` | `boolean` | No | Mobile sidebar menu visibility |
| `cartItems` | `Array<{_id, name, price, image, size, quantity}>` | **No** | Cart items (lost on refresh) |
| `wishlistItems` | `Array<{_id, name, price, image, description, category, subCategory, sizes}>` | **Yes (localStorage)** | Wishlist items |

### Context Values / Functions
| Value/Function | Description |
|----------------|-------------|
| `products` | Filtered & sorted product list (computed from static `products` array) |
| `currency` | Hardcoded to `'$'` |
| `delivery_fee` | Hardcoded to `10` |
| `getProductById(id)` | Find product by `_id` from static data |
| `addToCart(product, size, quantity)` | Add product to cart (with size) |
| `removeFromCart(productId, size)` | Remove specific product+size from cart |
| `updateCartItemQuantity(productId, size, newQuantity)` | Update quantity (removes if ≤ 0) |
| `cartItemCount` | Total quantity across all cart items |
| `cartSubtotal` | Sum of (price × quantity) for all cart items |
| `addToWishlist(product)` | Add product to wishlist (deduped by `_id`) |
| `removeFromWishlist(productId)` | Remove product from wishlist |
| `isInWishlist(productId)` | Check if product is in wishlist |
| `filterWishlist()` | Apply active filters to wishlist items |
| `wishlistItemCount` | Count of items in wishlist |
| `filters`, `setFilters` | Filter state getter/setter |
| `sortBy`, `setSortBy` | Sort state getter/setter |
| `mobileFilterVisible`, `setMobileFilterVisible` | Mobile filter visibility |
| `mobileMenuVisible`, `setMobileMenuVisible` | Mobile menu visibility |

**Note**: Product data is static in `assets/assets.js`. `filterProducts()` and `sortProducts()` compute derived state on every render.

## Building and Running

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Commands

```bash
cd frontend
npm install        # Install dependencies
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

## Routing

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, latest collection, features, newsletter |
| `/collection` | Collection | Full catalog with filters, sorting, search support |
| `/about` | About | About page |
| `/contact` | Contact | Contact page |
| `/userlogin` | UserLogin | Login page (UI only) |
| `/usersignup` | UserSignup | Registration page (UI only) |
| `/product/:productid` | Product | Detail view with gallery, reviews, related products |
| `/cart` | Cart | Cart items, quantity controls, totals, checkout button |
| `/wishlist` | WishList | Wishlist items with filter support |
| `/place-order` | PlaceOrder | **EMPTY** - checkout not implemented |
| `/orders` | Orders | Order history page |

## Development Conventions

### Code Style
- **Component Format**: Functional components with JSX (`.jsx` extension)
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: Relative paths with `.jsx` or `.js` extensions
- **Styling**: Tailwind CSS utility classes only (no custom CSS unless necessary)
- **Context Consumption**: `useContext(ShopContext)` in components that need global state

### Component Structure
- `src/components/` — Reusable UI (Navbar, Filter, ProductCard, etc.)
- `src/pages/` — Route-level components
- `src/context/` — Context creation and provider

### Data Flow
1. Products defined statically in `assets/assets.js`
2. `ShopContextProvider` filters/sorts products and provides cart/wishlist operations
3. Components consume context via `useContext(ShopContext)`

## Known Bugs & Issues

1. **Navbar.jsx** — Cart icon is **duplicated** (rendered twice around lines 80 and 92)
2. **Product.jsx** — Logic bug: `product.image[selectedImage]? null : setSelectedImage(0)` — ternary result is unused; should be an `if` or `useEffect`
3. **PlaceOrder.jsx** — Completely empty; checkout flow not implemented
4. **Cart not persisted** — Cart data is lost on page refresh (no localStorage)
5. **No backend** — All data is static; no real auth, payment, or order management
6. **Dummy reviews** — Hardcoded in Product.jsx, not tied to any data source
7. **No TypeScript** — Plain JS/JSX; no type safety

## Future Enhancements
1. Integrate backend API for dynamic product data
2. Implement real user authentication (JWT/session)
3. Add payment processing (Stripe/Razorpay SDK)
4. Persist cart to localStorage or backend
5. Migrate to TypeScript for type safety
6. Implement PlaceOrder page with real checkout flow
7. Implement Orders page with real order history
8. Remove duplicate cart icon in Navbar
9. Fix Product.jsx image selection bug

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main routing (11 routes) + Navbar + SearchBar + Footer |
| `src/context/ShopContext.jsx` | All global state: products, cart, wishlist, filters, UI toggles |
| `src/context/ShopContext.js` | `createContext(ShopContext)` export |
| `src/assets/assets.js` | 52 product definitions + all UI assets (images, icons) |
| `src/main.jsx` | Entry: BrowserRouter → ShopContextProvider → App |
| `src/index.css` | Tailwind imports + global font rules + active navlink style |
| `src/components/Navbar.jsx` | Top nav with links, search, wishlist, cart (×2 bug), profile dropdown, mobile menu |
| `src/components/Filter.jsx` | Category/subcategory checkboxes + price range sliders |
| `src/components/ProductCard.jsx` | Card component with image, name, price, bestseller badge |
| `src/pages/Collection.jsx` | Catalog page with filters, sort dropdown, search query support |
| `src/pages/Product.jsx` | Detail page with thumbnail gallery, size selector, reviews, related products |
| `src/pages/Cart.jsx` | Cart with quantity controls, remove, totals, checkout button |
| `src/pages/WishList.jsx` | Wishlist with filters, add-to-cart, remove actions, toast notifications |
| `src/pages/PlaceOrder.jsx` | **EMPTY** |
| `vite.config.js` | Vite config with @tailwindcss/vite + @vitejs/plugin-react |
| `package.json` | Dependencies, scripts, project metadata |
