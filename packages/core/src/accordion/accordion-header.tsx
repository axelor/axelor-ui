import { forwardRef } from 'react';

import { styleNames } from '../styles';
import { SystemProps, makeStyles, omitStyles } from '../system';

export interface AccordionHeaderProps extends SystemProps {
  collapsed?: boolean;
}

export const AccordionHeader = forwardRef<
  HTMLButtonElement,
  AccordionHeaderProps
>(({ collapsed, className, ...props }, ref) => {
  const styles = makeStyles(props);
  const rest = omitStyles(props);

  const classes = styleNames(
    styles,
    'accordion-button',
    { collapsed },
    className
  );

  return (
    <h2 className={styleNames('accordion-header')}>
      <button ref={ref} className={classes} type="button" {...rest} />
    </h2>
  );
});
