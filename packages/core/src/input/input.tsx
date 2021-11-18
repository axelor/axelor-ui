import { forwardRef } from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';

type InputType =
  | 'text'
  | 'number'
  | 'checkbox'
  | 'radio'
  | 'password'
  | 'email'
  | 'tel'
  | 'range'
  | 'color'
  | 'hidden'
  | 'file'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week';

export interface InputProps extends SystemProps {
  type?: InputType;
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  checked?: boolean;
  intermediate?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number;
  pattern?: string;
  accept?: string;
  multiple?: boolean;
  autoComplete?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', min, max, invalid, ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(
      styles,
      {
        'form-control': !['checkbox', 'radio', 'range'].includes(type),
        'form-check-input': ['checkbox', 'radio'].includes(type),
        'form-control-color': type === 'color',
        'form-range': type === 'range',
        'is-invalid': invalid,
      },
      className
    );

    let minMax = {};

    if (['text', 'email', 'password', 'tel', 'email'].includes(type)) {
      minMax = {
        minLength: min,
        maxLength: max,
      };
    } else {
      minMax = {
        min,
        max,
      };
    }

    return (
      <input ref={ref} type={type} className={classes} {...rest} {...minMax} />
    );
  }
);
