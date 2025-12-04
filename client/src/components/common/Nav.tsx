import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Nav() {
  const { user, loading, isAdmin } = useAuth();

  return (
    <nav class="nav">
      <div class="nav-container">
        <A href="/" class="nav-brand">
          La Maison Dorée
        </A>

        <Show when={!loading()}>
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
              <A href="/gallery" class="nav-link">
                Gallery
              </A>
              <Show when={!isAdmin()}>
                <A href="/menu" class="nav-link">
                  Menu
                </A>
                <A href="/cart" class="nav-link">
                  Cart
                </A>
                <A href="/orders" class="nav-link">
                  Orders
                </A>
                <A href="/book" class="nav-link">
                  Reservations
                </A>
                <A href="/profile" class="nav-link">
                  Profile
                </A>
              </Show>
              <Show when={isAdmin()}>
                <A href="/admin" class="nav-link admin-link">
                  Admin
                </A>
              </Show>

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
