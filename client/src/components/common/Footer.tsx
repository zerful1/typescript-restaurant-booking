import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Nav() {
  const { loading } = useAuth();

  return (
    <nav class="footer">
      <div class="footer-container">
        <Show when={!loading()}>
          <div class="footer-links">
            <A href="/about" class="footer-link">
              About
            </A>
            <A href="/contact" class="footer-link">
              Contact
            </A>
            <A href="/menu" class="footer-link">
              Menu
            </A>
            <div class="socials">
              <A href="">jews</A>
              <A href="">jews</A>
              <A href="">jews</A>
            </div>
          </div>
        </Show>
      </div>
    </nav>
  );
}
