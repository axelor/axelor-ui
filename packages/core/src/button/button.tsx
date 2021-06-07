import React from 'react';

import { styleNames } from '../styles';
import { ThemeColor } from '../types';

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  disabled?: boolean;
  outline?: boolean;
  type?: 'button' | 'reset' | 'submit' | string;
  size?: 'sm' | 'lg';
  variant?: ThemeColor;
}

export const Button: React.FC<ButtonProps> = React.forwardRef(
  ({
    disabled = false,
    outline = false,
    type = 'button',
    variant = 'default',
    size,
    className,
    ...props
  }) => {
    const btnVariant = ['btn', outline && 'outline', variant]
      .filter(x => x)
      .join('-');
    const btnSize = size ? `btn-${size}` : null;
    const classes = styleNames('btn', btnVariant, btnSize, className);
    return <button className={classes} {...{ disabled, ...props }} />;
  }
);
