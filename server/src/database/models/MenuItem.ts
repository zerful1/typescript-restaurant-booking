import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "../connection.js";

export interface MenuItemData {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  created_at: Date;
}

export async function getAllMenuItems(): Promise<MenuItemData[]> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM menu_items WHERE available = TRUE ORDER BY category, name"
  );

  return rows as MenuItemData[];
}

export async function getMenuItemById(id: number): Promise<MenuItemData | null> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM menu_items WHERE id = ?", [id]);

  if (rows.length === 0) return null;

  return rows[0] as MenuItemData;
}

export async function getMenuItemsByCategory(category: string): Promise<MenuItemData[]> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM menu_items WHERE category = ? AND available = TRUE ORDER BY name",
    [category]
  );

  return rows as MenuItemData[];
}

export async function getCategories(): Promise<string[]> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT DISTINCT category FROM menu_items WHERE available = TRUE ORDER BY category"
  );

  return rows.map((row) => row.category);
}

export async function createMenuItem(
  name: string,
  description: string | null,
  price: number,
  category: string,
  image_url: string | null
): Promise<number> {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)",
    [name, description, price, category, image_url]
  );

  return result.insertId;
}

export async function updateMenuItem(
  id: number,
  name: string,
  description: string | null,
  price: number,
  category: string,
  image_url: string | null,
  available: boolean
): Promise<boolean> {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image_url = ?, available = ? WHERE id = ?",
    [name, description, price, category, image_url, available, id]
  );

  return result.affectedRows > 0;
}

export async function deleteMenuItem(id: number): Promise<boolean> {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>("DELETE FROM menu_items WHERE id = ?", [id]);

  return result.affectedRows > 0;
}

export async function getMenuItemsByIds(ids: number[]): Promise<MenuItemData[]> {
  if (ids.length === 0) return [];

  const pool = getPool();
  const placeholders = ids.map(() => "?").join(",");

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM menu_items WHERE id IN (${placeholders}) AND available = TRUE`,
    ids
  );

  return rows as MenuItemData[];
}
