import React from 'react';
import { styleNames } from '../styles';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'lg';
  vertical?: boolean;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ size, vertical, className, role = 'group', ...props }, ref) => {
    const classes = styleNames(className, {
      [`btn-group`]: !vertical,
      [`btn-group-vertical`]: vertical,
      [`btn-group-${size}`]: size,
    });
    return <div ref={ref} className={classes} role={role} {...props} />;
  }
);
