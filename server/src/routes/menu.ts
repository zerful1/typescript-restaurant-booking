import express from "express";
import * as MenuItem from "../database/models/MenuItem.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all menu items
router.get("/menu", async (_req, res) => {
  try {
    const items = await MenuItem.getAllMenuItems();
    return res.json({ items });
  } catch (error) {
    console.error("Get menu items error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get menu categories
router.get("/menu/categories", async (_req, res) => {
  try {
    const categories = await MenuItem.getCategories();
    return res.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get menu item by ID
router.get("/menu/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const item = await MenuItem.getMenuItemById(parseInt(id, 10));

    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.json({ item });
  } catch (error) {
    console.error("Get menu item error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get menu items by category
router.get("/menu/category/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const items = await MenuItem.getMenuItemsByCategory(category);
    return res.json({ items });
  } catch (error) {
    console.error("Get menu items by category error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Create menu item
router.post("/menu", requireAdmin, async (req, res) => {
  const { name, description, price, category, image_url } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "Name, price, and category are required" });
  }

  try {
    const id = await MenuItem.createMenuItem(name, description, price, category, image_url);
    return res.status(201).json({ message: "Menu item created", id });
  } catch (error) {
    console.error("Create menu item error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Update menu item
router.put("/menu/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image_url, available } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "Name, price, and category are required" });
  }

  try {
    const updated = await MenuItem.updateMenuItem(
      parseInt(id, 10),
      name,
      description,
      price,
      category,
      image_url,
      available ?? true
    );

    if (!updated) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.json({ message: "Menu item updated" });
  } catch (error) {
    console.error("Update menu item error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Delete menu item
router.delete("/menu/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await MenuItem.deleteMenuItem(parseInt(id, 10));

    if (!deleted) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.json({ message: "Menu item deleted" });
  } catch (error) {
    console.error("Delete menu item error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
