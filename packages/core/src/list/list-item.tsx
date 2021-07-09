import React from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';

export interface ListItemProps extends SystemProps {
  active?: boolean;
  disabled?: boolean;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ active, disabled, className, ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(
      styles,
      'list-group-item',
      {
        active,
        disabled,
      },
      className
    );

    return <li ref={ref} className={classes} {...rest} />;
  }
);
