import express from "express";
import * as CartItem from "../database/models/CartItem.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get cart items
router.get("/cart", requireAuth, async (req, res) => {
  try {
    const items = await CartItem.getCartItems(req.session.userId!);
    const total = await CartItem.getCartTotal(req.session.userId!);
    const count = await CartItem.getCartItemCount(req.session.userId!);

    return res.json({ items, total, count });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Add item to cart
router.post("/cart/add", requireAuth, async (req, res) => {
  const { menuItemId, quantity } = req.body;

  if (!menuItemId) {
    return res.status(400).json({ message: "Menu item ID is required" });
  }

  try {
    await CartItem.addToCart(req.session.userId!, menuItemId, quantity || 1);
    const count = await CartItem.getCartItemCount(req.session.userId!);

    return res.status(201).json({ message: "Item added to cart", count });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update cart item quantity
router.put("/cart/update", requireAuth, async (req, res) => {
  const { menuItemId, quantity } = req.body;

  if (!menuItemId || quantity === undefined) {
    return res.status(400).json({ message: "Menu item ID and quantity are required" });
  }

  try {
    await CartItem.updateCartItemQuantity(req.session.userId!, menuItemId, quantity);
    const items = await CartItem.getCartItems(req.session.userId!);
    const total = await CartItem.getCartTotal(req.session.userId!);
    const count = await CartItem.getCartItemCount(req.session.userId!);

    return res.json({ message: "Cart updated", items, total, count });
  } catch (error) {
    console.error("Update cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Remove item from cart
router.delete("/cart/remove/:menuItemId", requireAuth, async (req, res) => {
  const { menuItemId } = req.params;

  try {
    const removed = await CartItem.removeFromCart(req.session.userId!, parseInt(menuItemId, 10));

    if (!removed) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const count = await CartItem.getCartItemCount(req.session.userId!);
    return res.json({ message: "Item removed from cart", count });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Clear cart
router.delete("/cart/clear", requireAuth, async (req, res) => {
  try {
    await CartItem.clearCart(req.session.userId!);
    return res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
