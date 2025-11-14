import { createSignal, onMount, For, Show } from "solid-js";
import { useFlash } from "../../contexts/FlashContext";
import BookingCard from "./BookingCard";

interface Booking {
  booking_id: string;
  booking_date: string;
  party_size: number;
  table_number: number;
  special_instructions: string | null;
}

export default function BookingList() {
  const { setFlash } = useFlash();

  const [bookings, setBookings] = createSignal<Booking[]>([]);
  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    loadBookings();
  });

  const loadBookings = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/book/list");

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error: any) {
      setFlash(error.message || "Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
  };

  return (
    <div class="booking-list-container">
      <Show when={loading()}>
        <p>Loading bookings...</p>
      </Show>

      <Show when={!loading()}>
        <Show
          when={bookings().length > 0}
          fallback={
            <div class="empty-state">
              <p>You don't have any bookings yet.</p>
              <p>Create your first booking to get started!</p>
            </div>
          }
        >
          <div class="booking-list">
            <For each={bookings()}>
              {(booking) => <BookingCard booking={booking} onDelete={handleDelete} />}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
