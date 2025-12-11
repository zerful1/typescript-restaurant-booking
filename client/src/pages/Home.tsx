import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div>
      <div>
        <h1>
          Welcome to <span>Our Restaurant</span>
        </h1>

        <Show when={!loading()}>
          <Show
            when={user()}
            fallback={
              <div>
                <A href="/register">Join Us</A>
                <A href="/login">Sign In</A>
              </div>
            }
          >
            <div>
              <A href="/book">Reserve a Table</A>
              <A href="/menu">View Our Menu</A>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
