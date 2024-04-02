import type { ButtonHTMLAttributes } from "react";

type ButtonKind = "primary" | "secondary" | "danger" | "outline" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  kind?: ButtonKind;
}

export function Button({
  children,
  kind = "primary",
  ...other
}: ButtonProps): JSX.Element {
  return (
    <button
      className={`btn btn-${kind}`}
      {...other}
      type={other.type ? other.type : "button"}
    >
      {children}
    </button>
  );
}
