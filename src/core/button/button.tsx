import styled from "../styled";
import { TVariant } from "../system";

export interface ButtonProps {
  outline?: boolean;
  size?: "sm" | "lg";
  variant?: TVariant | "link";
}

export const Button = styled.button<ButtonProps>(
  ({ disabled, variant, outline, size }) => [
    { disabled },
    {
      [`btn`]: true,
      [`btn-outline-${variant}`]: outline,
      [`btn-${variant}`]: !outline,
      [`btn-${size}`]: size,
    },
  ],
  ({ as = "button", type = "button", role = "button", disabled }) =>
    as !== "button" ? { role } : { disabled, type },
);
