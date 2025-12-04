import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div class="page">
      <div class="hero">
        <div class="hero-decoration">Est. 2015</div>
        <h1>
          Welcome to <span>La Maison Dorée</span>
        </h1>
        <p>
          Experience the art of fine dining in an intimate, elegant setting. Our carefully curated
          menu celebrates traditional cuisine with a modern touch.
        </p>

        <Show when={!loading()}>
          <Show
            when={user()}
            fallback={
              <div class="hero-buttons">
                <A href="/register" class="btn btn-primary">
                  Join Our Table
                </A>
                <A href="/login" class="btn btn-secondary">
                  Sign In
                </A>
              </div>
            }
          >
            <div class="hero-buttons">
              <A href="/book" class="btn btn-primary">
                Reserve a Table
              </A>
              <A href="/menu" class="btn btn-secondary">
                View Our Menu
              </A>
            </div>
          </Show>
        </Show>
      </div>

      <div class="features">
        <div class="feature-card">
          <div class="feature-icon">🍽️</div>
          <h3>Effortless Reservations</h3>
          <p>
            Secure your table with our simple online booking system. Choose your preferred date and
            time.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📋</div>
          <h3>Curated Experiences</h3>
          <p>
            Browse our seasonal menu and pre-order dishes to ensure a perfectly tailored dining
            experience.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3>Personal Touch</h3>
          <p>
            Share your dietary preferences and special requests. We attend to every detail of your
            visit.
          </p>
        </div>
      </div>
    </div>
  );
}
