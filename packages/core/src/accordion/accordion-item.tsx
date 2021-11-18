import { forwardRef } from 'react';

import { styleNames } from '../styles';
import { SystemProps, makeStyles, omitStyles } from '../system';

export interface AccordionItemProps extends SystemProps {
  flush?: boolean;
}

export const AccordionItem = forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(({ flush, className, ...props }, ref) => {
  const styles = makeStyles(props);
  const rest = omitStyles(props);

  const classes = styleNames(styles, 'accordion-item', className);

  return <div ref={ref} className={classes} {...rest} />;
});
