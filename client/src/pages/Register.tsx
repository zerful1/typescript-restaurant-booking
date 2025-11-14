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
      return setFlash("Passwords do not match:", "error");
    }

    if (password().length < 8) {
      return setFlash("Password must be at least 8 characters", "error");
    }

    setLoading(true);

    try {
      await register(email(), password());
      setFlash("Registration successful!", "success");
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
        <h1>Register</h1>

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

          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              required
              disabled={loading()}
              minLength={8}
            />
          </div>

          <button type="submit" class="btn btn-primary" disabled={loading()}>
            {loading() ? "Registering..." : "Register"}
          </button>
        </Form>

        <p class="text-center">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
