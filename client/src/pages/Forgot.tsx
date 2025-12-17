import { createSignal } from "solid-js";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function ForgotPassword() {
  const { setFlash } = useFlash();
  const [resetToken, setResetToken] = createSignal<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;

    try {
      const response = await fetch("/api/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (data.devToken) {
        setResetToken(data.devToken);
        setFlash("Reset token genetared:", "success");
      } else {
        setFlash(data.message, "success");
      }
    } catch (error: any) {
      setFlash(error.message || "Request failed", "error");
    }
  };

  const formDetails = {
    email: { Type: "email", Label: "Email" },
    $submit: "Send Reset Link",
  };

  return (
    <div>
      <div>
        <h1>Forgot Password</h1>
        <p>Enter your email to receive a password reset link.</p>

        <Form FormDetails={formDetails} SubmitCallback={handleSubmit} />

        {resetToken() && (
          <div>
            <h3>Development Mode - Reset Token:</h3>
            <code>{resetToken()}</code>
            <p>
              <a href={`/reset-password?token=${resetToken()}`}>Click here to reset password</a>
            </p>
          </div>
        )}

        <p>
          <a href="/login">Back to login</a>
        </p>
      </div>
    </div>
  );
}
