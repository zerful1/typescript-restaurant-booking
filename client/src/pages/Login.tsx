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
      setFlash("Login successful!", "success");
      navigate("/");
    } catch (error: any) {
      setFlash(error.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="page">
      <div class="card">
        <h1>Login</h1>

        <Form onSubmit={handleSubmit}>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              required
              disabled={loading()}
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              required
              disabled={loading()}
              minLength={8}
            />
          </div>

          <button type="submit" class="btn btn-primary" disabled={loading()}>
            {loading() ? "Logging in..." : "Login"}
          </button>
        </Form>

        <p class="text-center">
          Don't have an account? <a href="/register">Register</a>
        </p>
        <p class="text-center">
          <a href="/forgot">Forgot password?</a>
        </p>
      </div>
    </div>
  );
}
