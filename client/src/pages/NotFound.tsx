import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <div class="page">
      <div class="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p style="color: var(--color-text-muted); margin-bottom: var(--space-xl);">
          We couldn't find the page you're looking for. It may have been moved or no longer exists.
        </p>
        <A href="/" class="btn btn-primary">
          Return Home
        </A>
      </div>
    </div>
  );
}
