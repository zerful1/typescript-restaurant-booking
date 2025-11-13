import express from "express";
import { User } from "../database/index.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/forgot", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const token = await User.createPasswordReset(email);

    if (!token) {
      return res.status(404).json({ message: "If that email exists, a reset link has been sent" });
    }

    return res.status(200).json({
      message: "Password reset token created",
      token: token,
      resetLink: `http://localhost:3000/reset?token=${token}`,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset", async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const success = await User.completePasswordReset(token, password);

    if (!success) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
