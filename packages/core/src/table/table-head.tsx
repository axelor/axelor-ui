import { forwardRef } from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps, TVariant } from '../system';

export interface TableHeadProps extends SystemProps {
  color?: TVariant;
}

export const TableHead = forwardRef<HTMLElement, TableHeadProps>(
  ({ className, color, ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(
      styles,
      { [`table-${color}`]: color },
      className
    );

    return <thead ref={ref} className={classes} {...rest} />;
  }
);
