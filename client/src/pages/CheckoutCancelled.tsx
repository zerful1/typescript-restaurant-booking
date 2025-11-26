import { A } from "@solidjs/router";

export default function CheckoutCancelled() {
  return (
    <div class="page">
      <div class="checkout-result cancelled">
        <h1>❌ Checkout Cancelled</h1>
        <p>Your payment was cancelled. No charges have been made.</p>
        <p>Your cart items have been saved if you'd like to try again.</p>
        <div class="checkout-actions">
          <A href="/cart" class="btn btn-primary">
            Return to Cart
          </A>
          <A href="/menu" class="btn btn-secondary">
            Continue Shopping
          </A>
        </div>
      </div>
    </div>
  );
}
