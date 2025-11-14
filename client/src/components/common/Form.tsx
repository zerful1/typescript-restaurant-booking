import { type JSX } from "solid-js";

interface FormProps {
  onSubmit: (e: Event) => void;
  children: JSX.Element;
  class?: string;
}

export default function Form(props: FormProps) {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} class="props.class">
      {props.children}
    </form>
  );
}
