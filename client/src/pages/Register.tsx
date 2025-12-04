import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { setFlash } = useFlash();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async () => {
    if (password() !== confirmPassword()) {
      return setFlash("Passwords do not match", "error");
    }

    if (password().length < 8) {
      return setFlash("Password must be at least 8 characters", "error");
    }

    setLoading(true);

    try {
      await register(email(), password());
      setFlash("Welcome to La Maison Dorée!", "success");
      navigate("/");
    } catch (error: any) {
      setFlash(error.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="page">
      <div class="card">
        <h1>Join Us</h1>
        <p>Create your account to start making reservations.</p>

        <Form onSubmit={handleSubmit}>
          <div class="form-group">
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

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="At least 8 characters"
              required
              disabled={loading()}
              minLength={8}
            />
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              placeholder="Confirm your password"
              required
              disabled={loading()}
              minLength={8}
            />
          </div>

          <button type="submit" class="btn btn-primary" disabled={loading()} style="width: 100%;">
            {loading() ? "Creating Account..." : "Create Account"}
          </button>
        </Form>

        <p class="text-center">
          Already a member? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
