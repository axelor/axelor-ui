import React from 'react';

import { styleNames } from '../styles';
import { SystemProps, makeStyles, omitStyles } from '../system';

export interface AccordionProps extends SystemProps {
  flush?: boolean;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ flush, className, ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(
      styles,
      'accordion',
      { 'accordion-flush': flush },
      className
    );

    return <div ref={ref} className={classes} {...rest} />;
  }
);
