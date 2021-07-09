import React from 'react';

import { styleNames } from '../styles';
import {
  OverridableComponent,
  OverridableProps,
  SystemProps,
  makeStyles,
  omitStyles,
} from '../system';

export interface BoxProps extends SystemProps, OverridableProps {}

export const Box: OverridableComponent<'div', BoxProps> = React.forwardRef<
  HTMLDivElement,
  BoxProps
>(({ as, className, ...props }, ref) => {
  const classes = makeStyles(props);
  const rest = omitStyles(props);
  const Component = as || 'div';
  return (
    <Component
      ref={ref}
      className={styleNames(className, classes)}
      {...rest}
    ></Component>
  );
});
