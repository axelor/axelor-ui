import { forwardRef } from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';

export interface ListProps extends SystemProps {
  numbered?: boolean;
  flush?: boolean;
}

export const List = forwardRef<
  HTMLUListElement | HTMLOListElement,
  ListProps
>(({ numbered, flush, className, ...props }, ref) => {
  const styles = makeStyles(props);
  const rest = omitStyles(props);

  const classes = styleNames(
    styles,
    'list-group',
    {
      'list-group-numbered': numbered,
      'list-group-flush': flush,
    },
    className
  );

  const ListComponent = numbered ? 'ol' : 'ul';

  return <ListComponent ref={ref} className={classes} {...rest} />;
});
