import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "../connection.js";

export interface CartItemData {
  id: number;
  user_id: number;
  menu_item_id: number;
  quantity: number;
  created_at: Date;
}

export interface CartItemWithDetails extends CartItemData {
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
}

export async function getCartItems(userId: number): Promise<CartItemWithDetails[]> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT ci.*, mi.name, mi.description, mi.price, mi.category, mi.image_url
     FROM cart_items ci
     JOIN menu_items mi ON ci.menu_item_id = mi.id
     WHERE ci.user_id = ?
     ORDER BY ci.created_at DESC`,
    [userId]
  );

  return rows as CartItemWithDetails[];
}

export async function addToCart(
  userId: number,
  menuItemId: number,
  quantity: number = 1
): Promise<number> {
  const pool = getPool();

  // Use INSERT ... ON DUPLICATE KEY UPDATE to handle existing items
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO cart_items (user_id, menu_item_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [userId, menuItemId, quantity]
  );

  return result.insertId;
}

export async function updateCartItemQuantity(
  userId: number,
  menuItemId: number,
  quantity: number
): Promise<boolean> {
  const pool = getPool();

  if (quantity <= 0) {
    return removeFromCart(userId, menuItemId);
  }

  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND menu_item_id = ?",
    [quantity, userId, menuItemId]
  );

  return result.affectedRows > 0;
}

export async function removeFromCart(userId: number, menuItemId: number): Promise<boolean> {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM cart_items WHERE user_id = ? AND menu_item_id = ?",
    [userId, menuItemId]
  );

  return result.affectedRows > 0;
}

export async function clearCart(userId: number): Promise<boolean> {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>("DELETE FROM cart_items WHERE user_id = ?", [
    userId,
  ]);

  return result.affectedRows > 0;
}

export async function getCartTotal(userId: number): Promise<number> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT SUM(ci.quantity * mi.price) as total
     FROM cart_items ci
     JOIN menu_items mi ON ci.menu_item_id = mi.id
     WHERE ci.user_id = ?`,
    [userId]
  );

  return rows[0]?.total || 0;
}

export async function getCartItemCount(userId: number): Promise<number> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT SUM(quantity) as count FROM cart_items WHERE user_id = ?",
    [userId]
  );

  return rows[0]?.count || 0;
}
