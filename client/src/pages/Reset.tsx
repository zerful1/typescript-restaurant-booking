import { onMount } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { setFlash } = useFlash();
  const [searchParams] = useSearchParams();

  onMount(() => {
    const tokenFromUrl = searchParams.token;
    if (tokenFromUrl) {
      const tokenInput = document.getElementById("token") as HTMLInputElement;
      if (tokenInput) {
        tokenInput.value = Array.isArray(tokenFromUrl) ? tokenFromUrl[0] : tokenFromUrl;
      }
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setFlash("Passwords do not match", "error");
      return;
    }

    if (password.length < 8) {
      setFlash("Password must be at least 8 characters", "error");
      return;
    }

    try {
      const response = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
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
    }
  };

  const formDetails = {
    token: { Type: "text", Label: "Reset Token" },
    password: { Type: "password", Label: "New Password" },
    confirmPassword: { Type: "password", Label: "Confirm New Password" },
    $submit: "Reset Password",
  };

  return (
    <div>
      <div>
        <h1>Reset Password</h1>

        <Form FormDetails={formDetails} SubmitCallback={handleSubmit} />
      </div>
    </div>
  );
}
