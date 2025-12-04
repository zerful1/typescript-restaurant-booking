import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useFlash } from "../../contexts/FlashContext";
import Form from "../common/Form";

export default function BookingForm() {
  const navigate = useNavigate();
  const { setFlash } = useFlash();

  const [partySize, setPartySize] = createSignal(2);
  const [tableNumber, setTableNumber] = createSignal(1);
  const [datetime, setDatetime] = createSignal("");
  const [specialInstructions, setSpecialInstructions] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async () => {
    if (!datetime()) {
      setFlash("Please select a date and time", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/book/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          party_size: partySize(),
          table_number: tableNumber(),
          datetime: datetime(),
          special_instructions: specialInstructions(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setFlash("Your table has been reserved!", "success");
      navigate("/bookings");
    } catch (error: any) {
      setFlash(error.message || "Booking failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="booking-form-container">
      <Form onSubmit={handleSubmit}>
        <div class="form-group">
          <label for="party-size">Number of Guests</label>
          <input
            type="number"
            id="party-size"
            value={partySize()}
            onInput={(e) => setPartySize(Number(e.currentTarget.value))}
            min="1"
            max="20"
            required
            disabled={loading()}
          />
        </div>

        <div class="form-group">
          <label for="table-number">Preferred Table</label>
          <select
            id="table-number"
            value={tableNumber()}
            onChange={(e) => setTableNumber(Number(e.currentTarget.value))}
            disabled={loading()}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option value={num}>Table {num}</option>
            ))}
          </select>
        </div>

        <div class="form-group">
          <label for="datetime">Date & Time</label>
          <input
            type="datetime-local"
            id="datetime"
            value={datetime()}
            onInput={(e) => setDatetime(e.currentTarget.value)}
            required
            disabled={loading()}
          />
        </div>

        <div class="form-group">
          <label for="special-instructions">Special Requests (Optional)</label>
          <textarea
            id="special-instructions"
            value={specialInstructions()}
            onInput={(e) => setSpecialInstructions(e.currentTarget.value)}
            disabled={loading()}
            rows="4"
            placeholder="Dietary requirements, celebrations, seating preferences..."
          />
        </div>

        <button type="submit" class="btn btn-primary" disabled={loading()} style="width: 100%;">
          {loading() ? "Reserving..." : "Confirm Reservation"}
        </button>
      </Form>
    </div>
  );
}
