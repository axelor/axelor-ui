import { forwardRef } from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';

export interface TableCaptionProps extends SystemProps {
  placement?: 'top' | 'bottom';
}

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, placement, ...props }, ref) => {
  const styles = makeStyles(props);
  const rest = omitStyles(props);

  const classes = styleNames(
    styles,
    { 'caption-top': placement === 'top' },
    className
  );

  return <caption ref={ref} className={classes} {...rest} />;
});
