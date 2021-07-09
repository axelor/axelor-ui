import React from 'react';

import { styleNames } from '../styles';
import {
  OverridableProps,
  OverridableComponent,
  makeStyles,
  omitStyles,
  SystemProps,
  TVariant,
} from '../system';

export interface TableCellProps extends SystemProps, OverridableProps {
  as?: 'td' | 'th';
  color?: TVariant;
  selected?: boolean;
}

export const TableCell: OverridableComponent<'td', TableCellProps> =
  React.forwardRef<HTMLTableCellElement, TableCellProps>(
    ({ as: Component = 'td', className, color, selected, ...props }, ref) => {
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

      return <Component ref={ref} className={classes} {...rest} />;
    }
  );
