import { useNavigate } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setFlash } = useFlash();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      setFlash("Welcome back!", "success");
      navigate("/");
    } catch (error: any) {
      setFlash(error.message || "Login failed", "error");
    }
  };

  const formDetails = {
    email: { Type: "email", Label: "Email Address" },
    password: { Type: "password", Label: "Password" },
    $submit: "Sign In",
  };

  return (
    <div>
      <div>
        <h1>Welcome Back</h1>
        <p>Sign in to manage your reservations and orders.</p>

        <Form FormDetails={formDetails} SubmitCallback={handleSubmit} />

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
