import React from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps, TVariant } from '../system';

export interface TableRowProps extends SystemProps {
  color?: TVariant;
  selected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, color, selected, ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(
      styles,
      {
        [`table-${color}`]: color,
        'table-active': selected,
      },
      className
    );

    return <tr ref={ref} className={classes} {...rest} />;
  }
);
