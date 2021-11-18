import { forwardRef } from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';

export interface TableBodyProps extends SystemProps {}

export const TableBody = forwardRef<HTMLElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(styles, className);

    return <tbody ref={ref} className={classes} {...rest} />;
  }
);
