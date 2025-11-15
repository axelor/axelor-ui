import { JSX, useId } from "react";
import { MaterialIcon, MaterialIconProps } from "../../icons/material-icon";
import { Input, type InputProps } from "../input";
import { InputFeedback } from "../input-feedback";
import { InputLabel } from "../input-label";
import { withStyled } from "../styled";
import { useClassNames, useTheme } from "../styles";
import { findDataProp, makeTestId } from "../system/utils";
import styles from "./text-field.module.scss";

export interface TextFieldProps extends InputProps {
  label?: string | JSX.Element;
  icons?: MaterialIconProps[];
  description?: string | JSX.Element;
}

export const TextField = withStyled(Input)<TextFieldProps>((
  {
    id: providedId,
    label,
    icons = [],
    description,
    required,
    disabled,
    invalid,
    readOnly,
    ...inputProps
  },
  ref,
) => {
  const { dir = "" } = useTheme();
  const classNames = useClassNames();
  const testId = findDataProp(inputProps, "data-testid");
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const feedbackId = `${inputId}-feedback`;

  return (
    <div
      className={classNames([styles.container], {
        [styles.disabled]: disabled,
        [styles.readonly]: readOnly,
        [styles[dir]]: dir,
      })}
      data-testid={testId}
    >
      {label && (
        <InputLabel
          htmlFor={inputId}
          required={required}
          disabled={disabled}
          invalid={invalid}
          data-testid={makeTestId(testId, "label")}
        >
          {label}
        </InputLabel>
      )}
      <div
        className={classNames([
          styles.wrapper,
          {
            [styles[`icons-${icons.length}`]]: icons.length,
          },
        ])}
      >
        <Input
          ref={ref}
          id={inputId}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
          aria-invalid={invalid ? true : undefined}
          aria-required={required ? true : undefined}
          aria-describedby={description ? feedbackId : undefined}
          {...inputProps}
          data-testid={makeTestId(testId, "input")}
        />
        {icons.length > 0 && (
          <div className={styles.icons} aria-hidden="true">
            {icons.map((icon) => (
              <MaterialIcon
                key={icon.icon}
                {...icon}
                aria-hidden="true"
                data-testid={makeTestId(testId, "icon", icon.icon)}
              />
            ))}
          </div>
        )}
      </div>
      {description && (
        <InputFeedback
          id={feedbackId}
          invalid={invalid}
          role="status"
          aria-live={invalid ? "assertive" : "polite"}
          data-testid={makeTestId(testId, "feedback")}
        >
          {description}
        </InputFeedback>
      )}
    </div>
  );
});
