import { createResource, Show } from "solid-js";
import { A, useSearchParams } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

export default function CheckoutSuccess() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const verifyPayment = async () => {
    const sessionId = searchParams.session_id;
    if (!sessionId) return { success: false, status: "missing_session" };

    const res = await fetch(`/api/checkout/verify/${sessionId}`);
    if (!res.ok) return { success: false, status: "error" };
    return res.json();
  };

  const [verification] = createResource(() => user(), verifyPayment);

  return (
    <div class="checkout-page">
      <div class="checkout-container">
        <Show when={!verification.loading} fallback={<p>Verifying your payment...</p>}>
          <Show
            when={verification()?.success}
            fallback={
              <>
                <div class="checkout-icon checkout-warning">⚠️</div>
                <h1>Payment Verification</h1>
                <p>We couldn't verify your payment status. Please check your orders.</p>
                <div class="checkout-actions">
                  <A href="/orders" class="btn-primary">
                    View Orders
                  </A>
                  <A href="/" class="btn-secondary">
                    Return Home
                  </A>
                </div>
              </>
            }
          >
            <div class="checkout-icon checkout-success">✓</div>
            <h1>Thank You!</h1>
            <p>Your order has been received and is being prepared.</p>
            <Show when={verification()?.orderId}>
              <p class="order-id">Order #{verification()?.orderId}</p>
            </Show>
            <div class="checkout-actions">
              <A href="/orders" class="btn-primary">
                View Orders
              </A>
              <A href="/menu" class="btn-secondary">
                Continue Browsing
              </A>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
