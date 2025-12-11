import { createSignal, onMount } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { setFlash } = useFlash();
  const [searchParams] = useSearchParams();

  const [token, setToken] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  onMount(() => {
    const tokenFromUrl = searchParams.token;
    if (tokenFromUrl) {
      setToken(Array.isArray(tokenFromUrl) ? tokenFromUrl[0] : tokenFromUrl);
    }
  });

  const handleSubmit = async () => {
    if (newPassword() !== confirmPassword()) {
      setFlash("Passwords do not match", "error");
      return;
    }

    if (newPassword().length < 8) {
      setFlash("Password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token(),
          password: newPassword(),
          confirmPassword: confirmPassword(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reset failed");
      }

      setFlash("Password reset successful!", "success");
      navigate("/login");
    } catch (error: any) {
      setFlash(error.message || "Reset failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Reset Password</h1>

        <Form onSubmit={handleSubmit}>
          <div>
            <label for="token">Reset Token</label>
            <input
              type="text"
              id="token"
              value={token()}
              onInput={(e) => setToken(e.currentTarget.value)}
              required
              disabled={loading()}
            />
          </div>

          <div>
            <label for="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword()}
              onInput={(e) => setNewPassword(e.currentTarget.value)}
              required
              disabled={loading()}
              minLength={8}
            />
          </div>

          <div>
            <label for="confirm-password">Confirm New Password</label>
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

          <button type="submit" disabled={loading()}>
            {loading() ? "Resetting..." : "Reset Password"}
          </button>
        </Form>
      </div>
    </div>
  );
}
