import { Show } from "solid-js";
import { useFlash } from "../../contexts/FlashContext";

export default function Flash() {
  const { flash, clearFlash } = useFlash();

  return (
    <Show when={flash()}>
      <div class={`flash flash-${flash()!.type}`}>
        <span style="font-size: 1.1rem;">{flash()!.type === "success" ? "✓" : "!"}</span>
        <p>{flash()!.message}</p>
        <button onClick={clearFlash} class="flash-close" aria-label="Close">
          ✕
        </button>
      </div>
    </Show>
  );
}
