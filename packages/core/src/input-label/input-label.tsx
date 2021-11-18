import { forwardRef } from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';
import styles from './input-label.module.css';

export interface InputLabelProps extends SystemProps {
  htmlFor?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ invalid, disabled, required, className, children, ...props }, ref) => {
    const $styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(
      $styles,
      'form-label',
      {
        'text-danger': invalid,
        'text-muted': disabled,
        [styles.required]: required,
      },
      className
    );

    return (
      <label ref={ref} className={classes} {...rest}>
        {children}
      </label>
    );
  }
);
