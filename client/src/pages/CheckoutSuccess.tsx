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
    <div class="page">
      <div class="checkout-message checkout-success">
        <Show
          when={!verification.loading}
          fallback={<p style="color: var(--color-text-muted);">Verifying your payment...</p>}
        >
          <Show
            when={verification()?.success}
            fallback={
              <>
                <div class="checkout-icon">⚠️</div>
                <h1>Payment Verification</h1>
                <p style="color: var(--color-text-muted); margin-bottom: var(--space-xl);">
                  We couldn't verify your payment status. Please check your orders.
                </p>
                <div
                  class="checkout-actions"
                  style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;"
                >
                  <A href="/orders" class="btn btn-primary">
                    View Orders
                  </A>
                  <A href="/" class="btn btn-secondary">
                    Return Home
                  </A>
                </div>
              </>
            }
          >
            <div class="checkout-icon">✓</div>
            <h1>Thank You!</h1>
            <p style="color: var(--color-text-muted);">
              Your order has been received and is being prepared.
            </p>
            <Show when={verification()?.orderId}>
              <p style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-gold); margin: var(--space-lg) 0;">
                Order #{verification()?.orderId}
              </p>
            </Show>
            <div
              class="checkout-actions"
              style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;"
            >
              <A href="/orders" class="btn btn-primary">
                View Orders
              </A>
              <A href="/menu" class="btn btn-secondary">
                Continue Browsing
              </A>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
