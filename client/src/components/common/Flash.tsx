import { Show } from "solid-js";
import { useFlash } from "../../contexts/FlashContext";

export default function Flash() {
  const { flash, clearFlash } = useFlash();

  return (
    <Show when={flash()}>
      <div class={`flash flash-${flash()!.type}`}>
        <p>{flash()!.message}</p>
        <button onClick={clearFlash} class="flash-close">
          x
        </button>
      </div>
    </Show>
  );
}
