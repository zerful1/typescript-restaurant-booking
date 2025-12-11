import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setFlash } = useFlash();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await login(email(), password());
      setFlash("Welcome back!", "success");
      navigate("/");
    } catch (error: any) {
      setFlash(error.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Welcome Back</h1>
        <p>Sign in to manage your reservations and orders.</p>

        <Form onSubmit={handleSubmit}>
          <div>
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="your@email.com"
              required
              disabled={loading()}
            />
          </div>

          <div>
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="Enter your password"
              required
              disabled={loading()}
              minLength={8}
            />
          </div>

          <button type="submit" disabled={loading()}>
            {loading() ? "Signing in..." : "Sign In"}
          </button>
        </Form>

        <p>
          New here? <a href="/register">Create an account</a>
        </p>
        <p>
          <a href="/forgot">Forgot your password?</a>
        </p>
      </div>
    </div>
  );
}
