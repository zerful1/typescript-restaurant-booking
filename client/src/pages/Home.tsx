import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div class="page">
      <div class="hero">
        <h1>Welcome to Restaurant Booking</h1>
        <p>Reserve your table at our amazing restaurant</p>

        <Show when={!loading()}>
          <Show
            when={user()}
            fallback={
              <div class="hero-buttons">
                <A href="/register" class="btn btn-primary">
                  Get Started
                </A>
                <A href="/login" class="btn btn-secondary">
                  Login
                </A>
              </div>
            }
          >
            <div class="hero-buttons">
              <A href="/book" class="btn btn-primary">
                Make a Booking
              </A>
              <A href="/bookings" class="btn btn-secondary">
                View My Bookings
              </A>
            </div>
          </Show>
        </Show>
      </div>

      <div class="features">
        <div class="feature-card">
          <h3>Easy Booking</h3>
          <p>Book your table in just a few clicks</p>
        </div>
        <div class="feature-card">
          <h3>Manage Reservations</h3>
          <p>View and manage all your bookings in one place</p>
        </div>
        <div class="feature-card">
          <h3>Special Requests</h3>
          <p>Add special instructions for your dining experience</p>
        </div>
      </div>
    </div>
  );
}
