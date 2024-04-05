import type { ButtonHTMLAttributes } from "react";
import { css } from "@emotion/react";

type ButtonKind = "primary" | "secondary" | "danger" | "outline" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  kind?: ButtonKind;
}

const buttonStyles = css({
  padding: "8px 16px",
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
  "&:hover": {
    opacity: 0.8,
  },
});

const primaryStyles = css({
  backgroundColor: "#007bff",
  color: "#fff",
});

const secondaryStyles = css({
  backgroundColor: "#6c757d",
  color: "#fff",
});

const dangerStyles = css({
  backgroundColor: "#dc3545",
  color: "#fff",
});

const outlineStyles = css({
  backgroundColor: "transparent",
  border: "1px solid #007bff",
  color: "#007bff",
});

const linkStyles = css({
  backgroundColor: "transparent",
  border: "none",
  color: "#007bff",

  "&:hover": {
    textDecoration: "underline",
  },
});

const getButtonStyles = (kind: ButtonKind) => {
  switch (kind) {
    case "primary":
      return primaryStyles;
    case "secondary":
      return secondaryStyles;
    case "danger":
      return dangerStyles;
    case "outline":
      return outlineStyles;
    case "link":
      return linkStyles;
    default:
      return primaryStyles;
  }
};

export function Button({
  children,
  kind = "primary",
  ...other
}: ButtonProps): JSX.Element {
  return (
    <button
      {...other}
      css={[buttonStyles, getButtonStyles(kind)]}
      type={other.type ? other.type : "button"}
    >
      {children}
    </button>
  );
}
