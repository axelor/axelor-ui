import React from 'react';

import { styleNames } from '../styles';
import {
  TVariant,
  SystemProps,
  AsComponent,
  AsProp,
  makeStyles,
  omitStyles,
} from '../system';

export interface ButtonProps extends AsProp, SystemProps {
  disabled?: boolean;
  outline?: boolean;
  type?: 'button' | 'reset' | 'submit' | string;
  size?: 'sm' | 'lg';
  variant?: TVariant | 'link';
}

export const Button: AsComponent<'button', ButtonProps> = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      as,
      disabled = false,
      outline = false,
      type = 'button',
      variant,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);
    const classes = styleNames(className, styles, 'btn', {
      [`btn-outline-${variant}`]: outline,
      [`btn-${variant}`]: !outline,
      [`btn-${size}`]: size,
      disabled,
    });
    const Comp = as || 'button';
    const more = Comp === 'button' ? { disabled, type } : { role: 'button' };
    return <Comp ref={ref} className={classes} {...{ ...more, ...rest }} />;
  }
);
