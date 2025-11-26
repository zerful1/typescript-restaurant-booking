import { createResource, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

interface Order {
  id: number;
  user_id: number;
  stripe_session_id: string | null;
  status: "pending" | "paid" | "cancelled" | "refunded";
  total: number;
  created_at: string;
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth();

  const fetchOrders = async (): Promise<Order[]> => {
    const res = await fetch("/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data.orders;
  };

  const [orders] = createResource(() => user(), fetchOrders);

  const statusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "status-success";
      case "pending":
        return "status-warning";
      case "cancelled":
        return "status-error";
      case "refunded":
        return "status-info";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div class="page">
      <h1>Your Orders</h1>

      <Show when={!authLoading()}>
        <Show
          when={user()}
          fallback={
            <div class="auth-prompt">
              <p>Please log in to view your orders.</p>
              <A href="/login" class="btn btn-primary">
                Login
              </A>
            </div>
          }
        >
          <Show when={!orders.loading} fallback={<p>Loading orders...</p>}>
            <Show when={orders()}>
              {(orderList) => (
                <Show
                  when={orderList().length > 0}
                  fallback={
                    <div class="empty-orders">
                      <p>You haven't placed any orders yet.</p>
                      <A href="/menu" class="btn btn-primary">
                        Browse Menu
                      </A>
                    </div>
                  }
                >
                  <div class="orders-list">
                    <For each={orderList()}>
                      {(order) => (
                        <div class="order-card">
                          <div class="order-header">
                            <span class="order-id">Order #{order.id}</span>
                            <span class={`order-status ${statusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <div class="order-details">
                            <p class="order-date">{formatDate(order.created_at)}</p>
                            <p class="order-total">
                              <strong>Total:</strong> ${Number(order.total).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )}
                    </For>
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
