import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Nav() {
  const { user, loading } = useAuth();

  return (
    <nav class="nav">
      <div class="nav-container">
        <A href="/" class="nav-brand">
          Restaurant Booking
        </A>

        <Show when={!loading}>
          <div class="nav-links">
            <Show
              when={user()}
              fallback={
                <>
                  <A href="/login" class="nav-link">
                    Login
                  </A>
                  <A href="/register" class="nav-link">
                    Register
                  </A>
                </>
              }
            >
              <A href="/bookings" class="nav-link">
                My Bookings
              </A>
              <A href="/book" class="nav-link">
                New Booking
              </A>
              <A href="/profile" class="nav-link">
                Profile
              </A>
            </Show>
          </div>
        </Show>
      </div>
    </nav>
  );
}
