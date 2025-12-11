import { createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setFlash } = useFlash();

  createEffect(async () => {
    try {
      await logout();
      setFlash("Logged out successfully", "success");
      navigate("/");
    } catch (error) {
      setFlash("Logout failed", "error");
      navigate("/");
    }
  });

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
}
