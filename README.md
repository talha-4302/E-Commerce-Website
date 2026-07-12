# E-Commerce Website

A full-stack e-commerce app: React (Vite) frontend, Express/Node backend, MySQL database. Includes a storefront (browse, cart, wishlist, checkout, order history) and an admin panel (products, orders, users, dashboard).

## Live Demo

| | |
|---|---|
| Frontend | https://ecommerce-frontend-talha.vercel.app |
| Backend API | https://backend-production-460a.up.railway.app |

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express 5, JWT auth, bcryptjs |
| Database | MySQL (via `mysql2`) |

## Backend Architecture

The backend follows a layered architecture with centralized error handling:

```
routes  ->  controllers  ->  services  ->  repositories  ->  MySQL
```

- **routes** map URLs to controllers, nothing else.
- **controllers** parse the request and call a service, wrapped in `catchAsync` so no controller needs its own try/catch.
- **services** hold business rules and transaction orchestration. They throw `AppError` for expected failures (not found, invalid credentials, bad input).
- **repositories** are the only place SQL lives.
- **`middleware/errorHandler.js`** is the single place, mounted last in `app.js`, that catches every error and formats the response.

See [Project Structure](#project-structure) below for the full file layout.

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
   mysql -u root -p ezshop_db < backend/database/schema.sql
   ```
   Or open `backend/database/schema.sql` in a GUI tool (MySQL Workbench, TablePlus, HeidiSQL, phpMyAdmin) and run it against your new database.

   This creates empty tables only (no sample data). If you have a `.sql` dump with sample products/users, import that instead.

## 3. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (or copy `.env.example`):

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

By default the frontend talks to `http://localhost:5000`. To point it at a different backend (e.g. the deployed Railway API), create `frontend/.env` (see `frontend/.env.example`):

```env
VITE_BACKEND_URL=http://localhost:5000
```

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
├── backend/
│   ├── database/
│   │   └── schema.sql       table definitions (no data)
│   └── src/
│       ├── app.js            express app: middleware + routes (no listen)
│       ├── server.js         entry point, calls app.listen()
│       ├── config/           database.js (MySQL pool)
│       ├── constants/        PRODUCT_STATUS, ORDER_STATUS, ACCOUNT_STATUS, USER_ROLE
│       ├── routes/           URL -> controller mapping, incl. routes/admin/*
│       ├── controllers/      parses request, calls service, shapes response
│       ├── services/         business rules, throws AppError on failure
│       ├── repositories/     the only place SQL lives
│       ├── middleware/       auth.js (JWT), errorHandler.js (centralized)
│       └── utils/            AppError, catchAsync
└── frontend/
    └── src/
        ├── context/           AuthContext, ShopContext, ProductContext
        ├── pages/              storefront + admin pages
        ├── components/         shared UI components
        └── routes/             storeRoutes.jsx, adminRoutes.jsx
```

## Deployment

The live demo runs on:

- **Frontend**: Vercel, deployed from `frontend/` with `VITE_BACKEND_URL` set to the Railway API URL.
- **Backend + MySQL**: Railway, deployed from `backend/` with `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` referencing the MySQL plugin's variables and a real `JWT_SECRET` set.

## Troubleshooting

| Problem | Likely Fix |
|---|---|
| `Unable to connect to the MySQL database` | MySQL isn't running, or `DB_*` values in `backend/.env` are wrong |
| Frontend shows no products / network errors | Backend isn't running, or `VITE_BACKEND_URL` doesn't match where it's running |
| Admin login says "Not Authorized" | The user's `role` column isn't set to `admin` in the database |
| `npm install` fails with `spawn powershell.exe ENOENT` or similar cmd.exe errors on Windows | Your project path likely contains a character cmd.exe treats specially (e.g. `&`). Create a local (gitignored) `.npmrc` in `backend/` and/or `frontend/` with `script-shell=powershell.exe`. Do **not** commit it, it breaks Linux-based builds (Vercel/Railway) since `powershell.exe` doesn't exist there |
