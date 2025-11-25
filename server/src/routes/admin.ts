import express from "express";
import { User, Booking } from "../database/index.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/admin/users
 * List all users in the system
 */
router.get("/admin/users", requireAdmin, async (_req, res) => {
  try {
    const users = await User.getAllUsers();
    return res.json({ users });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete any user account (admin only)
 */
router.delete("/admin/users/:id", requireAdmin, async (req, res) => {
  const userId = Number.parseInt(req.params.id);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  // Prevent admin from deleting themselves
  if (userId === req.session.userId) {
    return res.status(403).json({ message: "Cannot delete your own account" });
  }

  try {
    const deleted = await User.deleteAccount(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /api/admin/bookings
 * List all bookings in the system
 */
router.get("/admin/bookings", requireAdmin, async (_req, res) => {
  try {
    const bookings = await Booking.getAllBookings();
    return res.json({ bookings });
  } catch (error) {
    console.error("Get all bookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * DELETE /api/admin/bookings/:id
 * Delete any booking (admin only)
 */
router.delete("/admin/bookings/:id", requireAdmin, async (req, res) => {
  const { id: bookingId } = req.params;

  try {
    const deleted = await Booking.deleteBookingById(bookingId);

    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Admin delete booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
