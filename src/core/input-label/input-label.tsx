import styled from "../styled";
import styles from "./input-label.module.css";

export interface InputLabelProps {
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

export const InputLabel = styled.label<InputLabelProps>(
  ({ invalid, disabled, required }) => [
    "form-label",
    styles.label,
    {
      "text-danger": invalid,
      "text-muted": disabled,
      [styles.required]: required,
    },
  ]
);
