import { A } from "@solidjs/router";

export default function CheckoutCancelled() {
  return (
    <div class="checkout-page">
      <div class="checkout-container">
        <div class="checkout-icon checkout-error">✕</div>
        <h1>Order Cancelled</h1>
        <p>Your checkout was cancelled. No charges have been made to your account.</p>
        <div class="checkout-actions">
          <A href="/cart" class="btn-primary">
            Return to Cart
          </A>
          <A href="/menu" class="btn-secondary">
            Browse Menu
          </A>
        </div>
      </div>
    </div>
  );
}
