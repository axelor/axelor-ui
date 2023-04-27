import { MaterialIcon, MaterialIconProps } from "../../icons/meterial-icon";
import { Input, type InputProps } from "../input";
import { InputFeedback } from "../input-feedback";
import { InputLabel } from "../input-label";
import { withStyled } from "../styled";
import { useClassNames, useTheme } from "../styles";
import styles from "./text-field.module.scss";

export interface TextFieldProps extends InputProps {
  label?: string | JSX.Element;
  icons?: MaterialIconProps[];
  description?: string | JSX.Element;
}

export const TextField = withStyled(Input)<TextFieldProps>(
  (
    {
      label,
      icons = [],
      description,
      required,
      disabled,
      invalid,
      readOnly,
      ...inputProps
    },
    ref
  ) => {
    const { dir = "" } = useTheme();
    const classNames = useClassNames();
    return (
      <div
        className={classNames([styles.container], {
          [styles.disabled]: disabled,
          [styles.readonly]: readOnly,
          [styles[dir]]: dir,
        })}
      >
        {label && (
          <InputLabel required={required} disabled={disabled} invalid={invalid}>
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
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            invalid={invalid}
            {...inputProps}
          />
          {icons.length > 0 && (
            <div className={styles.icons}>
              {icons.map((icon) => (
                <MaterialIcon key={icon.icon} {...icon} />
              ))}
            </div>
          )}
        </div>
        {description && (
          <InputFeedback invalid={invalid}>{description}</InputFeedback>
        )}
      </div>
    );
  }
);
