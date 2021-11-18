import { forwardRef } from 'react';
import { Input, InputProps } from '../input/input';

import { styleNames } from '../styles';
import styles from './switch.module.css';

export interface SwitchProps extends Omit<InputProps, 'type'> {
  checked?: boolean;
  readOnly?: boolean;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  value?: string;
  size?: 'sm' | 'lg';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ readOnly, className, size, ...rest }, ref) => {
    const classes = styleNames(className, { [styles[`size-${size}`]]: size });

    return (
      <div className={styleNames('form-check', 'form-switch')}>
        <Input
          ref={ref}
          className={classes}
          {...rest}
          type="checkbox"
          {...(readOnly ? { pointerEvents: 'none' } : {})}
        />
      </div>
    );
  }
);
