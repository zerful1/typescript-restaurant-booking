import { createSignal, createResource, For, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";

interface CartItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
}

interface CartData {
  items: CartItem[];
  total: number;
  count: number;
}

export default function Cart() {
  const { user, loading: authLoading } = useAuth();
  const { setFlash } = useFlash();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = createSignal(false);

  const fetchCart = async (): Promise<CartData> => {
    const res = await fetch("/api/cart");
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  };

  const [cart, { refetch }] = createResource(() => user(), fetchCart);

  const updateQuantity = async (menuItemId: number, quantity: number) => {
    try {
      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId, quantity }),
      });

      if (res.ok) {
        refetch();
      } else {
        const data = await res.json();
        setFlash(data.message || "Failed to update cart", "error");
      }
    } catch (error) {
      setFlash("Failed to update cart", "error");
    }
  };

  const removeItem = async (menuItemId: number) => {
    try {
      const res = await fetch(`/api/cart/remove/${menuItemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFlash("Item removed from cart", "success");
        refetch();
      } else {
        const data = await res.json();
        setFlash(data.message || "Failed to remove item", "error");
      }
    } catch (error) {
      setFlash("Failed to remove item", "error");
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch("/api/cart/clear", {
        method: "DELETE",
      });

      if (res.ok) {
        setFlash("Cart cleared", "success");
        refetch();
      } else {
        const data = await res.json();
        setFlash(data.message || "Failed to clear cart", "error");
      }
    } catch (error) {
      setFlash("Failed to clear cart", "error");
    }
  };

  const checkout = async () => {
    setCheckingOut(true);

    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to Stripe Checkout
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        const data = await res.json();
        setFlash(data.message || "Failed to create checkout session", "error");
      }
    } catch (error) {
      setFlash("Failed to create checkout session", "error");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div class="page">
      <h1>Your Cart</h1>

      <Show when={!authLoading()}>
        <Show
          when={user()}
          fallback={
            <div class="auth-prompt">
              <p>Please log in to view your cart.</p>
              <A href="/login" class="btn btn-primary">
                Login
              </A>
            </div>
          }
        >
          <Show when={!cart.loading} fallback={<p>Loading cart...</p>}>
            <Show when={cart()}>
              {(cartData) => (
                <Show
                  when={cartData().items.length > 0}
                  fallback={
                    <div class="empty-cart">
                      <p>Your cart is empty.</p>
                      <A href="/menu" class="btn btn-primary">
                        Browse Menu
                      </A>
                    </div>
                  }
                >
                  <div class="cart-items">
                    <For each={cartData().items}>
                      {(item) => (
                        <div class="cart-item">
                          <div class="cart-item-info">
                            <h3>{item.name}</h3>
                            <p class="cart-item-price">${Number(item.price).toFixed(2)} each</p>
                          </div>
                          <div class="cart-item-controls">
                            <button
                              class="btn btn-small"
                              onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span class="quantity">{item.quantity}</span>
                            <button
                              class="btn btn-small"
                              onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                            >
                              +
                            </button>
                            <span class="item-total">
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </span>
                            <button
                              class="btn btn-danger btn-small"
                              onClick={() => removeItem(item.menu_item_id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>

                  <div class="cart-summary">
                    <div class="cart-total">
                      <strong>Total:</strong> ${Number(cartData().total).toFixed(2)}
                    </div>
                    <div class="cart-actions">
                      <button class="btn btn-secondary" onClick={clearCart}>
                        Clear Cart
                      </button>
                      <button class="btn btn-primary" onClick={checkout} disabled={checkingOut()}>
                        {checkingOut() ? "Processing..." : "Checkout"}
                      </button>
                    </div>
                  </div>
                </Show>
              )}
            </Show>
          </Show>
        </Show>
      </Show>
    </div>
  );
}
