import { createSignal } from "solid-js";
import { useFlash } from "../contexts/FlashContext";
import Form from "../components/common/Form";

export default function Contact() {
  const { setFlash } = useFlash();

  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async () => {
    if (!name() || !email() || !message()) {
      setFlash("Please fill in all fields", "error");
      return;
    }

    setLoading(true);

    // Simulate sending a message
    setTimeout(() => {
      setFlash("Message sent! We'll get back to you soon.", "success");
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div class="page">
      <div class="card">
        <h1>Contact Us</h1>
        <p>Have questions? We'd love to hear from you!</p>

        <Form onSubmit={handleSubmit}>
          <div class="form-group">
            <label for="name">Name</label>
            <input
              type="text"
              id="name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              required
              disabled={loading()}
            />
          </div>

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
            <label for="message">Message</label>
            <textarea
              id="message"
              value={message()}
              onInput={(e) => setMessage(e.currentTarget.value)}
              required
              disabled={loading()}
              rows="5"
            />
          </div>

          <button type="submit" class="btn btn-primary" disabled={loading()}>
            {loading() ? "Sending..." : "Send Message"}
          </button>
        </Form>

        <div class="contact-info">
          <h3>Other Ways to Reach Us</h3>
          <p>Email: info@restaurantbooking.com</p>
          <p>Phone: +44 7753 742567</p>
          <p>Address: 123 Main Street, City, State 12345</p>
        </div>
      </div>
    </div>
  );
}
