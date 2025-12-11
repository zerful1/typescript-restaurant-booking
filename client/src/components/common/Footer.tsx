import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Footer() {
  const { loading } = useAuth();

  return (
    <footer>
      <div>
        <Show when={!loading()}>
          <div>
            <A href="/about">About Us</A>
            <A href="/contact">Contact</A>
            <A href="/menu">Our Menu</A>
            <A href="/gallery">Gallery</A>
          </div>
          <p>© 2025 Our Restaurant. All rights reserved.</p>
        </Show>
      </div>
    </footer>
  );
}
