import React from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps, TVariant } from '../system';

export interface TableFootProps extends SystemProps {
  color?: TVariant;
}

export const TableFoot = React.forwardRef<HTMLElement, TableFootProps>(
  ({ className, color, ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(
      styles,
      { [`table-${color}`]: color },
      className
    );

    return <tfoot ref={ref} className={classes} {...rest} />;
  }
);
