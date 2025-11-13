import express from "express";
import crypto from "crypto";
import {
  checkBookingConflict,
  createBooking,
  bookingIdConflict,
  getUserBookings,
  deleteBooking,
} from "../database/models/Booking.js";

const router = express.Router();

router.post("/book/create", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { party_size, table_number, datetime, special_instructions } = req.body;

  if (!party_size || !table_number || !datetime) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const bookingDate = new Date(datetime);

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: "Invalid datetime format" });
    }

    const isConflict = await checkBookingConflict(table_number, bookingDate);

    if (isConflict) {
      return res.status(409).json({ message: "Booking conflict" });
    }

    let bookingId = crypto.randomBytes(4).toString("hex");
    while (await bookingIdConflict(bookingId)) {
      bookingId = crypto.randomBytes(4).toString("hex");
    }

    await createBooking(
      bookingId,
      bookingDate,
      party_size,
      table_number,
      special_instructions,
      req.session.userId
    );

    return res.status(201).json({ message: "Booking created successfully", bookingId });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/book/list", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const bookings = await getUserBookings(req.session.userId);
    return res.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/book/delete/:bookingId", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { bookingId } = req.params;

  try {
    const deleted = await deleteBooking(bookingId, req.session.userId);

    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
