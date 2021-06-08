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

export const Button: React.FC<ButtonProps> = React.forwardRef(
  ({
    disabled = false,
    outline = false,
    type = 'button',
    variant,
    size,
    className,
    ...props
  }) => {
    const classes = styleNames(className, 'btn', {
      [`btn-outline-${variant}`]: outline,
      [`btn-${variant}`]: !outline,
      [`btn-${size}`]: size,
    });
    return <button className={classes} {...{ disabled, ...props }} />;
  }
);
