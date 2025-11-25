import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Nav() {
  const { user, loading, isAdmin } = useAuth();

  return (
    <nav class="nav">
      <div class="nav-container">
        <A href="/" class="nav-brand">
          Restaurant Booking
        </A>

        <Show when={!loading()}>
          <div class="nav-links">
            <A href="/about" class="nav-link">
              About
            </A>
            <A href="/contact" class="nav-link">
              Contact
            </A>
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
              <Show when={isAdmin()}>
                <A href="/admin" class="nav-link admin-link">
                  Admin
                </A>
              </Show>
              <A href="/profile" class="nav-link">
                Profile
              </A>
              <A href="/logout" class="nav-link">
                Logout
              </A>
            </Show>
          </div>
        </Show>
      </div>
    </nav>
  );
}
