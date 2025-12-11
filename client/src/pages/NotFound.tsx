import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <div>
      <div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          We couldn't find the page you're looking for. It may have been moved or no longer exists.
        </p>
        <A href="/">Return Home</A>
      </div>
    </div>
  );
}
