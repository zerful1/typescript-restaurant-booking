import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getPool } from "../connection.js";

export interface BookingData {
  booking_id: string;
  booking_date: Date;
  party_size: number;
  table_number: number;
  special_instructions: string | null;
  id: number;
}

export async function checkBookingConflict(
  table: number,
  datetime: Date
): Promise<boolean> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT 1 FROM bookings WHERE table_number = ? AND booking_date = ?",
    [table, datetime]
  );

  return rows.length > 0;
}

export async function bookingIdConflict(id: number): Promise<boolean> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT 1 FROM bookings WHERE booking_id = ?",
    [id]
  );

  return rows.length > 0;
}

export async function createBooking(
  booking_id: string,
  booking_date: Date,
  party_size: number,
  table_number: number,
  special_instructions: string | null,
  id: number
): Promise<void> {
  const pool = getPool();

  if (!special_instructions) special_instructions = "";

  const [_rows] = await pool.query<ResultSetHeader>(
    "INSERT INTO bookings (booking_id, booking_date, party_size, table_number, special_instructions, id) VALUES (?, ?, ?, ?, ?, ?)",
    [
      booking_id,
      booking_date,
      party_size,
      table_number,
      special_instructions,
      id,
    ]
  );
}

export async function getUserBookings(userId: number): Promise<BookingData[]> {
  const pool = getPool();

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM bookings WHERE id = ? ORDER BY booking_date DESC",
    [userId]
  );

  return rows as BookingData[];
}

export async function deleteBooking(bookingId: number, userId: number) {
  const pool = getPool();

  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM bookings WHERE booking_id = ? AND id = ?",
    [bookingId, userId]
  );

  return result.affectedRows > 0;
}
