import { createSignal, onMount, Show, For } from "solid-js";
import { useFlash } from "../contexts/FlashContext";

interface User {
  id: number;
  email: string;
  role: "user" | "admin";
}

interface Booking {
  booking_id: string;
  booking_date: string;
  party_size: number;
  table_number: number;
  special_instructions: string | null;
  user_id: number;
}

export default function Admin() {
  const [activeTab, setActiveTab] = createSignal<"users" | "bookings">("users");
  const [users, setUsers] = createSignal<User[]>([]);
  const [bookings, setBookings] = createSignal<Booking[]>([]);
  const [loading, setLoading] = createSignal(false);
  const { setFlash } = useFlash();

  onMount(() => {
    fetchUsers();
    fetchBookings();
  });

  async function fetchUsers() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      setFlash((error as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookings() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/bookings");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      setFlash((error as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(userId: number, email: string) {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete user");
      }

      setFlash("User deleted successfully", "success");
      setUsers(users().filter((u) => u.id !== userId));
    } catch (error) {
      setFlash((error as Error).message, "error");
    }
  }

  async function deleteBooking(bookingId: string) {
    if (!confirm(`Are you sure you want to delete booking ${bookingId}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete booking");
      }

      setFlash("Booking deleted successfully", "success");
      setBookings(bookings().filter((b) => b.booking_id !== bookingId));
    } catch (error) {
      setFlash((error as Error).message, "error");
    }
  }

  return (
    <div class="page">
      <div class="admin-container">
        <h1>Admin Dashboard</h1>

        <div class="admin-tabs">
          <button
            class={activeTab() === "users" ? "tab-active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users ({users().length})
          </button>
          <button
            class={activeTab() === "bookings" ? "tab-active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings ({bookings().length})
          </button>
        </div>

        <Show when={activeTab() === "users"}>
          <div class="admin-section">
            <h2>User Management</h2>
            <Show
              when={loading()}
              fallback={
                <Show when={users().length > 0} fallback={<p>No users found.</p>}>
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={users()}>
                        {(user) => (
                          <tr>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>
                              <span class={`role-badge role-${user.role}`}>{user.role}</span>
                            </td>
                            <td>
                              <button
                                class="btn-danger"
                                onClick={() => deleteUser(user.id, user.email)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </Show>
              }
            >
              <p>Loading users...</p>
            </Show>
          </div>
        </Show>

        <Show when={activeTab() === "bookings"}>
          <div class="admin-section">
            <h2>Booking Management</h2>
            <Show
              when={loading()}
              fallback={
                <Show when={bookings().length > 0} fallback={<p>No bookings found.</p>}>
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Date</th>
                        <th>Table</th>
                        <th>Party Size</th>
                        <th>User ID</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={bookings()}>
                        {(booking) => (
                          <tr>
                            <td>{booking.booking_id}</td>
                            <td>{new Date(booking.booking_date).toLocaleString()}</td>
                            <td>{booking.table_number}</td>
                            <td>{booking.party_size}</td>
                            <td>{booking.user_id}</td>
                            <td>
                              <button
                                class="btn-danger"
                                onClick={() => deleteBooking(booking.booking_id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </Show>
              }
            >
              <p>Loading bookings...</p>
            </Show>
          </div>
        </Show>

        <style>{`
        .admin-container {
          background: #27272a;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid #3f3f46;
        }

        .admin-container h1 {
          color: #fafafa;
          margin-bottom: 2rem;
        }

        .admin-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #3f3f46;
        }

        .admin-tabs button {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
          color: #a1a1aa;
        }

        .admin-tabs button:hover {
          background-color: #3f3f46;
          color: #e4e4e7;
        }

        .admin-tabs .tab-active {
          border-bottom-color: #60a5fa;
          color: #60a5fa;
          font-weight: 600;
        }

        .admin-section {
          margin-top: 2rem;
        }

        .admin-section h2 {
          color: #fafafa;
          margin-bottom: 1rem;
        }

        .admin-section p {
          color: #a1a1aa;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          background: #18181b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #3f3f46;
        }

        .admin-table thead {
          background-color: #27272a;
        }

        .admin-table th,
        .admin-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #3f3f46;
        }

        .admin-table th {
          font-weight: 600;
          color: #fafafa;
        }

        .admin-table td {
          color: #e4e4e7;
        }

        .admin-table tbody tr:hover {
          background-color: #27272a;
        }

        .role-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .role-badge.role-admin {
          background-color: #422006;
          color: #fbbf24;
          border: 1px solid #ea580c;
        }

        .role-badge.role-user {
          background-color: #18181b;
          color: #a1a1aa;
          border: 1px solid #52525b;
        }

        .btn-danger {
          background-color: #dc2626;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.2s;
        }

        .btn-danger:hover {
          background-color: #b91c1c;
        }

        .btn-danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      </div>
    </div>
  );
}
