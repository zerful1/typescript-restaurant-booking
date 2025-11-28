import { createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const { user, loading: authLoading } = useAuth();
  const { setFlash } = useFlash();
  const { cartWithDetails, updateQuantity, removeItem, clearCart, total, isLoading } = useCart();
  const [checkingOut, setCheckingOut] = createSignal(false);

  const checkout = async () => {
    if (!user()) {
      setFlash("Please log in to checkout", "error");
      return;
    }

    setCheckingOut(true);

    try {
      const cartItems = cartWithDetails().map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          clearCart();
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
          <Show when={!isLoading()} fallback={<p>Loading cart...</p>}>
            <Show
              when={cartWithDetails().length > 0}
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
                <For each={cartWithDetails()}>
                  {(item) => (
                    <Show when={item.details}>
                      <div class="cart-item">
                        <div class="cart-item-info">
                          <h3>{item.details!.name}</h3>
                          <p class="cart-item-price">
                            £{Number(item.details!.price).toFixed(2)} each
                          </p>
                        </div>
                        <div class="cart-item-controls">
                          <button
                            class="btn btn-small"
                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span class="quantity">{item.quantity}</span>
                          <button
                            class="btn btn-small"
                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          >
                            +
                          </button>
                          <span class="item-total">
                            £{(Number(item.details!.price) * item.quantity).toFixed(2)}
                          </span>
                          <button
                            class="btn btn-danger btn-small"
                            onClick={() => removeItem(item.menuItemId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </Show>
                  )}
                </For>
              </div>

              <div class="cart-summary">
                <div class="cart-total">
                  <strong>Total:</strong> £{total().toFixed(2)}
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
          </Show>
        </Show>
      </Show>
    </div>
  );
}
