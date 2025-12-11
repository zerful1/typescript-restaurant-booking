import { type JSX } from "solid-js";

interface FormProps {
  onSubmit: (e: Event) => void;
  children: JSX.Element;
}

export default function Form(props: FormProps) {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(e);
  };

  return <form onSubmit={handleSubmit}>{props.children}</form>;
}
