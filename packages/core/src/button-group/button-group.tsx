import { forwardRef } from 'react';
import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';

export interface ButtonGroupProps extends SystemProps {
  size?: 'sm' | 'lg';
  vertical?: boolean;
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ size, vertical, className, role = 'group', ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);
    const classes = styleNames(className, styles, {
      [`btn-group`]: !vertical,
      [`btn-group-vertical`]: vertical,
      [`btn-group-${size}`]: size,
    });
    return <div ref={ref} className={classes} role={role} {...rest} />;
  }
);
