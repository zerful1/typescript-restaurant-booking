CREATE DATABASE IF NOT EXISTS [db] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE [db];

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  reset_token CHAR(64) DEFAULT NULL,
  reset_expires DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id VARCHAR(8) NOT NULL PRIMARY KEY,
  booking_date DATETIME NOT NULL,
  party_size INT UNSIGNED NOT NULL,
  table_number INT UNSIGNED NOT NULL,
  special_instructions TEXT,
  user_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS menu_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  menu_item_id INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, menu_item_id)
); -- save in localStorage instead

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  stripe_session_id VARCHAR(255),
  status ENUM('pending', 'paid', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  menu_item_id INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

INSERT INTO users(email, password_hash, role) SELECT "admin@admin.com", "$2b$10$Fwi60zeuBL9Z0vMHy0Ygke7ZEzyVkDliAObo5M3J4zPnTLRxr78Mi", "admin" WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = "admin@admin.com"
);

-- Seed some sample menu items
INSERT INTO menu_items (name, description, price, category) SELECT "Margherita Pizza", "Classic tomato sauce, mozzarella, and fresh basil", 12.99, "Pizza" WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = "Margherita Pizza");
INSERT INTO menu_items (name, description, price, category) SELECT "Pepperoni Pizza", "Tomato sauce, mozzarella, and pepperoni", 14.99, "Pizza" WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = "Pepperoni Pizza");
INSERT INTO menu_items (name, description, price, category) SELECT "Caesar Salad", "Romaine lettuce, parmesan, croutons, Caesar dressing", 9.99, "Salads" WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = "Caesar Salad");
INSERT INTO menu_items (name, description, price, category) SELECT "Spaghetti Carbonara", "Pasta with egg, cheese, pancetta, and pepper", 16.99, "Pasta" WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = "Spaghetti Carbonara");
INSERT INTO menu_items (name, description, price, category) SELECT "Tiramisu", "Classic Italian coffee-flavored dessert", 7.99, "Desserts" WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = "Tiramisu");
INSERT INTO menu_items (name, description, price, category) SELECT "Garlic Bread", "Toasted bread with garlic butter and herbs", 5.99, "Starters" WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = "Garlic Bread");
