import { forwardRef } from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps, TVariant } from '../system';

export interface TableProps extends SystemProps {
  color?: TVariant;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  size?: 'sm' | 'md';
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    { className, color, striped, bordered, hover, size = 'md', ...props },
    ref
  ) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(
      styles,
      'table',
      {
        [`table-${color}`]: color,
        'table-striped': striped,
        'table-bordered': bordered,
        'table-hover': hover,
        [`table-${size}`]: size !== 'md',
      },
      className
    );

    return <table ref={ref} className={classes} {...rest} />;
  }
);
