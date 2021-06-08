import React from 'react';

import { styleNames } from '../styles';
import { ThemeColor } from '../types';

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  disabled?: boolean;
  outline?: boolean;
  type?: 'button' | 'reset' | 'submit' | string;
  size?: 'sm' | 'lg';
  variant?: ThemeColor | 'link';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
    const classes = styleNames(className, 'btn', {
      [`btn-outline-${variant}`]: outline,
      [`btn-${variant}`]: !outline,
      [`btn-${size}`]: size,
      disabled,
    });
    return <button ref={ref} className={classes} {...{ disabled, ...props }} />;
  }
);
