import { Show } from "solid-js";
import { useFlash } from "../../contexts/FlashContext";

export default function Flash() {
  const { flash, clearFlash } = useFlash();

  return (
    <Show when={flash()}>
      <div class={`flash flash-${flash()!.type}`}>
        <span class="flash-icon">{flash()!.type === "success" ? "✓" : "!"}</span>
        <p class="flash-message">{flash()!.message}</p>
        <button class="flash-close" onClick={clearFlash} aria-label="Close">
          ✕
        </button>
      </div>
    </Show>
  );
}
