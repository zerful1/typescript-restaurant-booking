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
      // Send cart items to server for checkout
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
    <>
      {/* Overlay */}
      <div class={`cart-overlay ${isPanelOpen() ? "open" : ""}`} onClick={closePanel} />

      {/* Side Panel */}
      <div class={`cart-side-panel ${isPanelOpen() ? "open" : ""}`}>
        <div class="cart-panel-header">
          <h2>Your Cart ({itemCount()})</h2>
          <button class="cart-panel-close" onClick={closePanel}>
            ✕
          </button>
        </div>

        <div class="cart-panel-content">
          <Show when={!isLoading()} fallback={<p class="cart-loading">Loading cart...</p>}>
            <Show
              when={cartWithDetails().length > 0}
              fallback={
                <div class="cart-empty">
                  <p>Your cart is empty</p>
                  <button class="btn btn-primary" onClick={closePanel}>
                    Continue Shopping
                  </button>
                </div>
              }
            >
              <div class="cart-panel-items">
                <For each={cartWithDetails()}>
                  {(item) => (
                    <Show when={item.details}>
                      <div class="cart-panel-item">
                        <div class="cart-panel-item-info">
                          <h4>{item.details!.name}</h4>
                          <p class="cart-panel-item-price">
                            £{Number(item.details!.price).toFixed(2)} each
                          </p>
                        </div>
                        <div class="cart-panel-item-controls">
                          <div class="quantity-controls">
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
                          </div>
                          <span class="item-total">
                            £{(Number(item.details!.price) * item.quantity).toFixed(2)}
                          </span>
                          <button
                            class="btn btn-danger btn-small"
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
            <div class="cart-panel-total">
              <strong>Total:</strong>
              <span>£{total().toFixed(2)}</span>
            </div>
            <div class="cart-panel-actions">
              <button class="btn btn-secondary" onClick={clearCart}>
                Clear Cart
              </button>
              <Show
                when={user()}
                fallback={
                  <A href="/login" class="btn btn-primary" onClick={closePanel}>
                    Login to Checkout
                  </A>
                }
              >
                <button class="btn btn-primary" onClick={checkout} disabled={checkingOut()}>
                  {checkingOut() ? "Processing..." : "Checkout"}
                </button>
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
}
