CREATE DATABASE IF NOT EXISTS [db] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE [db];

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  reset_token CHAR(64) DEFAULT NULL,
  reset_expires DATETIME DEFAULT NULL,
);

CREATE TABLE IF NOT EXIST bookings (
  booking_id INT VARCHAR(8) NOT NULL,
  booking_date DATETIME NOT NULL,
  party_size INT UNSIGED NOT NULL,
  table_number INT UNSIGED NOT NULL,
  special_instructions TEXT,
  id INT UNSIGNED NOT NULL
  FOREIGN KEY (id) REFERENCES users(id),
);

INSERT INTO users(email, password_hash) SELECT "admin@admin.com", "password_hash" WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = "admin@admin.com"
);