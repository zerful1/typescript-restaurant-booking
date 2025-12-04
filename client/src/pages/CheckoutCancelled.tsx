import { A } from "@solidjs/router";

export default function CheckoutCancelled() {
  return (
    <div class="page">
      <div class="checkout-message checkout-cancelled">
        <div class="checkout-icon">✕</div>
        <h1>Order Cancelled</h1>
        <p style="color: var(--color-text-muted); margin-bottom: var(--space-xl);">
          Your checkout was cancelled. No charges have been made to your account. Your items are
          still in your cart.
        </p>
        <div
          class="checkout-actions"
          style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;"
        >
          <A href="/cart" class="btn btn-primary">
            Return to Cart
          </A>
          <A href="/menu" class="btn btn-secondary">
            Browse Menu
          </A>
        </div>
      </div>
    </div>
  );
}
