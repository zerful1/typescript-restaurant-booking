import { useNavigate } from "@solidjs/router";
import { useFlash } from "../../contexts/FlashContext";
import Form from "../common/Form";

export default function BookingForm() {
  const navigate = useNavigate();
  const { setFlash } = useFlash();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const party_size = Number(formData.get("party_size"));
    const table_number = Number(formData.get("table_number"));
    const datetime = formData.get("datetime") as string;
    const special_instructions = formData.get("special_instructions") as string;

    if (!datetime) {
      setFlash("Please select a date and time", "error");
      return;
    }

    try {
      const response = await fetch("/api/book/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          party_size,
          table_number,
          datetime,
          special_instructions,
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
    }
  };

  const formDetails = {
    party_size: { Type: "number", Label: "Number of Guests" },
    table_number: { Type: "number", Label: "Preferred Table" },
    datetime: { Type: "datetime-local", Label: "Date & Time" },
    special_instructions: { Type: "text", Label: "Special Requests (Optional)" },
    $submit: "Confirm Reservation",
  };

  return (
    <div class="booking-form">
      <Form FormDetails={formDetails} SubmitCallback={handleSubmit} />
    </div>
  );
}
