import { createSignal, onMount, Show } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import BookingForm from "../components/bookings/BookingForm";
import BookingList from "../components/bookings/BookingList";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [view, setView] = createSignal<"list" | "create">("list");

  onMount(() => {
    if (location.pathname === "/book") {
      setView("create");
    } else {
      setView("list");
    }
  });

  if (!loading() && !user()) {
    navigate("/login");
    return null;
  }

  return (
    <div class="booking-page">
      <div class="booking-container">
        <div class="booking-header">
          <h1>{view() === "create" ? "Reserve a Table" : "My Reservations"}</h1>
          <div class="booking-tabs">
            <button
              class={view() === "list" ? "tab-active" : ""}
              onClick={() => {
                setView("list");
                navigate("/bookings");
              }}
            >
              My Reservations
            </button>
            <button
              class={view() === "create" ? "tab-active" : ""}
              onClick={() => {
                setView("create");
                navigate("/book");
              }}
            >
              New Reservation
            </button>
          </div>
        </div>

        <Show when={!loading()}>
          <div class="booking-content">
            <Show when={view() === "create"} fallback={<BookingList />}>
              <BookingForm />
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}
