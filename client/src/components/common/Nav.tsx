import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Nav() {
  const { user, loading, isAdmin } = useAuth();

  return (
    <nav>
      <div>
        <A href="/">Our Restaurant</A>

        <Show when={!loading()}>
          <div>
            <Show
              when={user()}
              fallback={
                <>
                  <A href="/login">Login</A>
                  <A href="/register">Register</A>
                </>
              }
            >
              <A href="/gallery">Gallery</A>
              <Show when={!isAdmin()}>
                <A href="/menu">Menu</A>
                <A href="/cart">Cart</A>
                <A href="/orders">Orders</A>
                <A href="/book">Reservations</A>
                <A href="/profile">Profile</A>
              </Show>
              <Show when={isAdmin()}>
                <A href="/admin">Admin</A>
              </Show>

              <A href="/logout">Logout</A>
            </Show>
          </div>
        </Show>
      </div>
    </nav>
  );
}
