import { createContext, useContext, createSignal, type JSX } from "solid-js";

interface FlashMessage {
  message: string;
  type: "success" | "error" | "info";
}

interface FlashContextType {
  flash: () => FlashMessage | null;
  setFlash: (message: string, type: "success" | "error" | "info") => void;
  clearFlash: () => void;
}

const FlashContext = createContext<FlashContextType>();

export function FlashProvider(props: { children: JSX.Element }) {
  const [flash, setFlashState] = createSignal<FlashMessage | null>(null);

  function setFlash(message: string, type: "success" | "error" | "info") {
    setFlashState({ message, type });

    setTimeout(() => {
      setFlashState(null);
    }, 5000);
  }

  function clearFlash() {
    setFlashState(null);
  }

  const value: FlashContextType = {
    flash,
    setFlash,
    clearFlash,
  };

  return <FlashContext.Provider value={value}>{props.children}</FlashContext.Provider>;
}
export function useFlash() {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error("useFlash must be used within FlashProvider");
  }
  return context;
}
