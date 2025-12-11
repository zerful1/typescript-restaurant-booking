import { createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useFlash } from "../../contexts/FlashContext";

export default function CartSidePanel() {
  const { user } = useAuth();
  const { setFlash } = useFlash();
  const {
    cartWithDetails,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    total,
    isLoading,
    isPanelOpen,
    closePanel,
  } = useCart();

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
    <Show when={isPanelOpen()}>
      <div class="cart-overlay" onClick={closePanel} />

      <div class="cart-panel">
        <div class="cart-panel-header">
          <h2>Your Cart ({itemCount()})</h2>
          <button class="cart-panel-close" onClick={closePanel}>
            ✕
          </button>
        </div>

        <div class="cart-panel-content">
          <Show when={!isLoading()} fallback={<p>Loading cart...</p>}>
            <Show
              when={cartWithDetails().length > 0}
              fallback={
                <div class="cart-empty">
                  <p>Your cart is empty</p>
                  <button class="btn-secondary" onClick={closePanel}>
                    Continue Shopping
                  </button>
                </div>
              }
            >
              <div class="cart-items">
                <For each={cartWithDetails()}>
                  {(item) => (
                    <Show when={item.details}>
                      <div class="cart-item">
                        <div class="cart-item-info">
                          <h4>{item.details!.name}</h4>
                          <p>£{Number(item.details!.price).toFixed(2)} each</p>
                        </div>
                        <div class="cart-item-actions">
                          <div class="quantity-controls">
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <span class="cart-item-total">
                            £{(Number(item.details!.price) * item.quantity).toFixed(2)}
                          </span>
                          <button
                            class="cart-item-remove"
                            onClick={() => removeItem(item.menuItemId)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </Show>
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </div>

        <Show when={cartWithDetails().length > 0}>
          <div class="cart-panel-footer">
            <div class="cart-total">
              <strong>Total:</strong>
              <span>£{total().toFixed(2)}</span>
            </div>
            <div class="cart-actions">
              <button class="btn-secondary" onClick={clearCart}>
                Clear Cart
              </button>
              <Show
                when={user()}
                fallback={
                  <A href="/login" class="btn-primary" onClick={closePanel}>
                    Login to Checkout
                  </A>
                }
              >
                <button class="btn-primary" onClick={checkout} disabled={checkingOut()}>
                  {checkingOut() ? "Processing..." : "Checkout"}
                </button>
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </Show>
  );
}
