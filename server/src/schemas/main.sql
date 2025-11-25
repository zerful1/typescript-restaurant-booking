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

INSERT INTO users(email, password_hash, role) SELECT "admin@admin.com", "$2b$10$Fwi60zeuBL9Z0vMHy0Ygke7ZEzyVkDliAObo5M3J4zPnTLRxr78Mi", "admin" WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = "admin@admin.com"
);
