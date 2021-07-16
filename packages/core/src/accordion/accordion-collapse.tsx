import React from 'react';

import { Collapse, CollapseProps } from '../collapse/collapse';
import { styleNames } from '../styles';
import { makeStyles, omitStyles } from '../system';

export interface AccordionCollapseProps
  extends CollapseProps,
    React.HTMLAttributes<HTMLElement> {}

export const AccordionCollapse = React.forwardRef<
  HTMLDivElement,
  AccordionCollapseProps
>(({ children, className, ...props }, ref) => {
  const styles = makeStyles(props);
  const rest = omitStyles(props);

  const classes = styleNames(styles, 'accordion-collapse', className);

  return (
    <Collapse ref={ref} className={classes} {...rest}>
      <div className={styleNames('accordion-body')}>{children}</div>
    </Collapse>
  );
});
