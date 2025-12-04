import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../contexts/AuthContext";

export default function Footer() {
  const { loading } = useAuth();

  return (
    <footer class="footer">
      <div class="footer-container">
        <Show when={!loading()}>
          <div class="footer-links">
            <A href="/about" class="footer-link">
              About Us
            </A>
            <A href="/contact" class="footer-link">
              Contact
            </A>
            <A href="/menu" class="footer-link">
              Our Menu
            </A>
            <A href="/gallery" class="footer-link">
              Gallery
            </A>
          </div>
          <p style="margin-top: 1.5rem; margin-bottom: 0; font-size: 0.85rem; color: var(--color-text-dim);">
            © 2025 La Maison Dorée. All rights reserved.
          </p>
        </Show>
      </div>
    </footer>
  );
}
