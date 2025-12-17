import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { setFlash } = useFlash();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      return setFlash("Passwords do not match", "error");
    }

    if (password.length < 8) {
      return setFlash("Password must be at least 8 characters", "error");
    }

    try {
      await register(email, password);
      setFlash("Welcome! Your account has been created.", "success");
      navigate("/");
    } catch (error: any) {
      setFlash(error.message || "Registration failed", "error");
    }
  };

  const formDetails = {
    email: { Type: "email", Label: "Email Address" },
    password: { Type: "password", Label: "Password" },
    confirmPassword: { Type: "password", Label: "Confirm Password" },
    $submit: "Create Account",
  };

  return (
    <div>
      <div>
        <h1>Join Us</h1>
        <p>Create your account to start making reservations.</p>

        <Form FormDetails={formDetails} SubmitCallback={handleSubmit} />

        <p>
          Already a member? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
