import { ComponentProps, forwardRef, useState } from "react";
import { useClassNames } from "..";
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

const inputClassNames = (
  invalid?: boolean,
  large?: boolean,
  small?: boolean,
) => ({
  [styles.invalid]: invalid,
  [styles["input-sm"]]: small,
  [styles["input-lg"]]: large,
  "form-control-sm": small,
  "form-control-lg": large,
});

export const Input = styled.input<InputProps>(
  ({ type = "text", invalid, large, small }) => [
    styles.input,
    formClass(type),
    inputClassNames(invalid, large, small),
  ],
  ({ type = "text" }) => ({ type }),
);

type AdornedInputProps = ComponentProps<typeof Input> & {
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
};

const AdornedInputComponent = forwardRef<HTMLInputElement, AdornedInputProps>(
  (props, ref) => {
    const {
      startAdornment,
      endAdornment,
      type = "text",
      invalid,
      large,
      small,
      className,
      ...inputProps
    } = props;
    const classNames = useClassNames();
    const [focused, setFocused] = useState(false);

    return (
      <span
        className={classNames(
          styles.adorned,
          styles.input,
          focused && styles.focus,
          formClass(type),
          inputClassNames(invalid, large, small),
          className,
        )}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {startAdornment && (
          <span className={styles.adornment}>{startAdornment}</span>
        )}
        <Input ref={ref} type={type} {...inputProps} />
        {endAdornment && (
          <span className={styles.adornment}>{endAdornment}</span>
        )}
      </span>
    );
  },
);

export const AdornedInput = forwardRef<HTMLInputElement, AdornedInputProps>(
  (props, ref) => {
    const { startAdornment, endAdornment, ...inputProps } = props;

    return startAdornment || endAdornment ? (
      <AdornedInputComponent {...props} ref={ref} />
    ) : (
      <Input {...inputProps} ref={ref} />
    );
  },
);
