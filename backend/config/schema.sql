-- E-Commerce Project Database Schema
-- Last Updated: 2026-04-24

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    account_status ENUM('active', 'banned') DEFAULT 'active',
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    bestseller TINYINT(1) DEFAULT 0,
    product_status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    created_at DATETIME NOT NULL
);

-- Product Images Table
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product Sizes Table
CREATE TABLE product_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    size VARCHAR(10) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart Items Table
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    size VARCHAR(10),
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_entry (user_id, product_id, size)
);

-- Wishlist Items Table
CREATE TABLE wishlist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_entry (user_id, product_id)
);

-- Orders Table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    size VARCHAR(10),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
