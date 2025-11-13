import express from "express";
import { User } from "../database/index.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const existingUserId = await User.getUserId(email);

    if (existingUserId) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const userId = await User.registerUser(email, password);

    req.session.userId = userId;

    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const userId = await User.canLoginUser(email, password);

    if (!userId) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.userId = userId;

    return res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ message: "Not logged in" });
  }

  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Failed to logout" });
    }

    res.clearCookie("connect.sid");

    return res.json({ message: "Logout successful" });
  });
  return;
});

router.post("/userdata", async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ message: "Not authenticated" });
  }

  try {
    const userData = await User.getUserData(req.session.userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(userData);
  } catch (error) {
    console.error("Get user data error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/delete", async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ message: "Not authenticated" });
  }

  try {
    const deleted = await User.deleteAccount(req.session.userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.destroy((error) => {
      if (error) {
        console.error("Session destroy error:", error);
        return res.status(500).json({ message: "Account deleted but failed to clear session" });
      }

      res.clearCookie("connect.sid");
      return res.json({ message: "Account deleted successfully" });
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  return;
});

export default router;
