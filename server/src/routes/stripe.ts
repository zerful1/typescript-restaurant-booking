import express from "express";
import Stripe from "stripe";
import * as MenuItem from "../database/models/MenuItem.js";
import * as Order from "../database/models/Order.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
});

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

interface CartItemInput {
  menuItemId: number;
  quantity: number;
}

// Create Stripe Checkout Session
router.post("/checkout/create-session", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { items } = req.body as { items: CartItemInput[] };

    // Validate cart items from request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch menu item prices from database (prevents price manipulation)
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await MenuItem.getMenuItemsByIds(menuItemIds);

    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: "Some items are no longer available" });
    }

    // Calculate total using DB prices
    let total = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const cartItem of items) {
      const menuItem = menuItems.find((mi) => mi.id === cartItem.menuItemId);
      if (!menuItem) continue;

      total += menuItem.price * cartItem.quantity;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: menuItem.name,
            description: menuItem.description ?? "",
          },
          unit_amount: Math.round(menuItem.price * 100), // Stripe expects cents
        },
        quantity: cartItem.quantity,
      });
    }

    // Create order in database
    const orderId = await Order.createOrder(userId, total);

    // Add order items
    for (const cartItem of items) {
      const menuItem = menuItems.find((mi) => mi.id === cartItem.menuItemId);
      if (menuItem) {
        await Order.addOrderItem(orderId, menuItem.id, cartItem.quantity, menuItem.price);
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/checkout/cancelled`,
      metadata: {
        orderId: orderId.toString(),
        userId: userId.toString(),
      },
    });

    // Update order with Stripe session ID
    await Order.updateOrderStripeSession(orderId, session.id);

    return res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Verify checkout session and update order status
router.get("/checkout/verify/:sessionId", requireAuth, async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Update order status
      const order = await Order.getOrderByStripeSession(sessionId);

      if (order) {
        await Order.updateOrderStatus(order.id, "paid");
        // Cart is cleared client-side via localStorage
      }

      return res.json({
        success: true,
        status: "paid",
        orderId: order?.id,
      });
    }

    return res.json({
      success: false,
      status: session.payment_status,
    });
  } catch (error) {
    console.error("Verify checkout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Stripe Webhook to handle payment events
router.post("/webhook/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Stripe webhook secret not configured");
    return res.status(500).json({ message: "Webhook not configured" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ message: "Webhook signature verification failed" });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === "paid") {
        const order = await Order.getOrderByStripeSession(session.id);

        if (order) {
          await Order.updateOrderStatus(order.id, "paid");
          // Cart is cleared client-side via localStorage
        }
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await Order.getOrderByStripeSession(session.id);

      if (order) {
        await Order.updateOrderStatus(order.id, "cancelled");
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.json({ received: true });
});

// Get user's orders
router.get("/orders", requireAuth, async (req, res) => {
  try {
    const orders = await Order.getUserOrders(req.session.userId!);
    return res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get order details
router.get("/orders/:orderId", requireAuth, async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.getOrderById(parseInt(orderId, 10));

    if (!order || order.user_id !== req.session.userId) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
