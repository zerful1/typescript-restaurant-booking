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
      setFlash("Thank you for your message. We'll be in touch shortly.", "success");
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div class="page">
      <div class="card" style="max-width: 550px;">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond promptly.</p>

        <Form onSubmit={handleSubmit}>
          <div class="form-group">
            <label for="name">Your Name</label>
            <input
              type="text"
              id="name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="John Smith"
              required
              disabled={loading()}
            />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="john@example.com"
              required
              disabled={loading()}
            />
          </div>

          <div class="form-group">
            <label for="message">Your Message</label>
            <textarea
              id="message"
              value={message()}
              onInput={(e) => setMessage(e.currentTarget.value)}
              placeholder="How can we help you?"
              required
              disabled={loading()}
              rows="5"
            />
          </div>

          <button type="submit" class="btn btn-primary" disabled={loading()} style="width: 100%;">
            {loading() ? "Sending..." : "Send Message"}
          </button>
        </Form>

        <div class="contact-info">
          <h3>Visit Us</h3>
          <p>📧 reservations@lamaisondoree.com</p>
          <p>📞 +44 20 7946 0958</p>
          <p>📍 42 Golden Lane, London EC1Y 0RZ</p>
        </div>
      </div>
    </div>
  );
}
