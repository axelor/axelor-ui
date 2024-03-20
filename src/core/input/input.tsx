import { ComponentProps, forwardRef } from "react";
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

export const AdornedInput = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof Input> & {
    endAdornment?: JSX.Element;
  }
>((props, ref) => {
  const {
    endAdornment,
    type = "text",
    invalid,
    large,
    small,
    className,
    ...inputProps
  } = props;
  const classNames = useClassNames();

  if (!endAdornment) {
    return (
      <Input
        ref={ref}
        type={type}
        invalid={invalid}
        large={large}
        small={small}
        className={className}
        {...inputProps}
      />
    );
  }

  return (
    <span
      className={classNames(
        styles.adorned,
        styles.input,
        formClass(type),
        inputClassNames(invalid, large, small),
        className,
      )}
    >
      <Input ref={ref} type={type} {...inputProps} />
      <span className={styles.endAdornment}>{endAdornment}</span>
    </span>
  );
});
