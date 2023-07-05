import styled from "../styled";
import styles from "./input.module.scss";

export interface InputProps {
  intermediate?: boolean;
  invalid?: boolean;
  large?: boolean;
  small?: boolean;
}

const formClass = (type: string) => {
  switch (type) {
    case "checkbox":
    case "radio":
      return "form-check-input";
    case "range":
      return "form-range";
    case "color":
      return "form-control-color";
    default:
      return "form-control";
  }
};

export const Input = styled.input<InputProps>(
  ({ type = "text", invalid, large, small }) => [
    styles.input,
    formClass(type),
    {
      [styles.invalid]: invalid,
      [styles["input-sm"]]: small,
      [styles["input-lg"]]: large,
      "form-control-sm": small,
      "form-control-lg": large,
    },
  ],
  ({ type = "text" }) => ({ type })
);
