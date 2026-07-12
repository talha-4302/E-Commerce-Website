# E-Commerce Website

A full-stack e-commerce app: React (Vite) frontend, Express/Node backend, MySQL database. Includes a storefront (browse, cart, wishlist, checkout, order history) and an admin panel (products, orders, users, dashboard).

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express 5, JWT auth, bcrypt |
| Database | MySQL (via `mysql2`) |

## Prerequisites

Install these before you start:

- [Node.js](https://nodejs.org/) v18 or newer (includes npm)
- MySQL Server, or a bundle like [XAMPP](https://www.apachefriends.org/) / [WAMP](https://www.wampserver.com/) that includes MySQL
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/talha-4302/E-Commerce-Website.git
cd E-Commerce-Website
```

## 2. Set Up the Database

1. Start your MySQL server.
2. Create a database (default name expected is `ezshop_db`, but you can name it anything as long as your `.env` matches):
   ```sql
   CREATE DATABASE ezshop_db;
   ```
3. Import the schema. Using the MySQL CLI:
   ```bash
   mysql -u root -p ezshop_db < backend/config/schema.sql
   ```
   Or open `backend/config/schema.sql` in a GUI tool (MySQL Workbench, TablePlus, HeidiSQL, phpMyAdmin) and run it against your new database.

   This creates empty tables only (no sample data). If you have a `.sql` dump with sample products/users, import that instead.

## 3. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (or edit the existing one):

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ezshop_db
JWT_SECRET=replace_this_with_any_long_random_string
```

Run the backend:

```bash
npm run server   # nodemon, auto-restarts on file changes
# or
npm start        # plain node, no auto-restart
```

The API will be live at `http://localhost:5000`. You should see:

```
Server started on PORT: 5000
Raw MySQL Connection has been established successfully.
```

If you see a MySQL connection error instead, double-check `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` and that your MySQL server is running.

## 4. Set Up the Frontend

Open a **new terminal** (keep the backend running):

```bash
cd frontend
npm install
npm run dev
```

The site will be live at `http://localhost:5173`.

> The frontend currently talks to the backend at a fixed `http://localhost:5000` (set in `frontend/src/context/AuthContext.jsx`). If you run the backend on a different port, update that value to match.

## 5. Using the App

| Page | Path |
|---|---|
| Storefront | `http://localhost:5173/` |
| User login | `http://localhost:5173/userlogin` |
| User signup | `http://localhost:5173/usersignup` |
| Admin login | `http://localhost:5173/admin/login` |

### Creating an Admin User

There's no signup form for admins. To make a user an admin:

1. Register a normal account at `/usersignup`.
2. In your MySQL database, promote it:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
   ```
3. Log in at `/admin/login` with that same email/password.

## Project Structure

```
.
├── backend/            Express API
│   ├── config/          database.js (MySQL pool), schema.sql
│   ├── controllers/     route logic (products, cart, orders, users, admin/*)
│   ├── middleware/      JWT auth middleware
│   ├── routes/           Express routers
│   └── server.js         app entry point
└── frontend/            React app (Vite)
    └── src/
        ├── context/       AuthContext, ShopContext, ProductContext
        ├── pages/         storefront + admin pages
        ├── components/    shared UI components
        └── routes/        storeRoutes.jsx, adminRoutes.jsx
```

## Troubleshooting

| Problem | Likely Fix |
|---|---|
| `Unable to connect to the MySQL database` | MySQL isn't running, or `DB_*` values in `backend/.env` are wrong |
| Frontend shows no products / network errors | Backend isn't running, or isn't on port 5000 (see step 4 note above) |
| Admin login says "Not Authorized" | The user's `role` column isn't set to `admin` in the database |
| `Incorrect arguments to mysqld_stmt_execute` on product/order/user lists | You're running MySQL 8+/9 with an older code checkout that used `LIMIT ? OFFSET ?` placeholders; pull the latest `main`/`master` |
