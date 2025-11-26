import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "../connection.js";

export interface OrderData {
  id: number;
  user_id: number;
  stripe_session_id: string | null;
  status: "pending" | "paid" | "cancelled" | "refunded";
  total: number;
  created_at: Date;
}

export interface OrderItemData {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price_at_purchase: number;
}

export interface OrderItemWithDetails extends OrderItemData {
  name: string;
  description: string | null;
  category: string;
}

export interface OrderWithItems extends OrderData {
  items: OrderItemWithDetails[];
}

export async function createOrder(
  userId: number,
  total: number,
  stripeSessionId: string | null = null
): Promise<number> {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO orders (user_id, stripe_session_id, total) VALUES (?, ?, ?)",
    [userId, stripeSessionId, total]
  );

  return result.insertId;
}

export async function addOrderItem(
  orderId: number,
  menuItemId: number,
  quantity: number,
  priceAtPurchase: number
): Promise<number> {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
    [orderId, menuItemId, quantity, priceAtPurchase]
  );

  return result.insertId;
}

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "paid" | "cancelled" | "refunded"
): Promise<boolean> {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>("UPDATE orders SET status = ? WHERE id = ?", [
    status,
    orderId,
  ]);

  return result.affectedRows > 0;
}

export async function updateOrderStripeSession(
  orderId: number,
  stripeSessionId: string
): Promise<boolean> {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE orders SET stripe_session_id = ? WHERE id = ?",
    [stripeSessionId, orderId]
  );

  return result.affectedRows > 0;
}

export async function getOrderByStripeSession(stripeSessionId: string): Promise<OrderData | null> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM orders WHERE stripe_session_id = ?",
    [stripeSessionId]
  );

  if (rows.length === 0) return null;

  return rows[0] as OrderData;
}

export async function getOrderById(orderId: number): Promise<OrderWithItems | null> {
  const pool = getPool();

  const [orderRows] = await pool.query<RowDataPacket[]>("SELECT * FROM orders WHERE id = ?", [
    orderId,
  ]);

  if (orderRows.length === 0) return null;

  const order = orderRows[0] as OrderData;

  const [itemRows] = await pool.query<RowDataPacket[]>(
    `SELECT oi.*, mi.name, mi.description, mi.category
     FROM order_items oi
     JOIN menu_items mi ON oi.menu_item_id = mi.id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  return {
    ...order,
    items: itemRows as OrderItemWithDetails[],
  };
}

export async function getUserOrders(userId: number): Promise<OrderData[]> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  return rows as OrderData[];
}

export async function getAllOrders(): Promise<OrderData[]> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM orders ORDER BY created_at DESC");

  return rows as OrderData[];
}
