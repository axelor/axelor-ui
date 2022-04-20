import React from 'react';
import { Icon, type SvgIcon } from '../icon';
import { Input, type InputProps } from '../input';
import { InputFeedback } from '../input-feedback';
import { InputLabel } from '../input-label';
import { withStyled } from '../styled';
import { useClassNames, useTheme } from '../styles';
import styles from './text-field.module.scss';

export interface TextFieldIcon {
  id: string;
  icon: SvgIcon;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

interface TextFieldProps extends InputProps {
  label?: string | JSX.Element;
  icons?: Array<TextFieldIcon>;
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
    const { dir = '' } = useTheme();
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
              {icons.map(icon => (
                <Icon key={icon.id} as={icon.icon} onClick={icon.onClick} />
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
