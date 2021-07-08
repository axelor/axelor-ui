import React from 'react';

import {
  AsComponent,
  AsProp,
  SystemProps,
  makeStyles,
  omitStyles,
} from '../system';
import { styleNames } from '../styles';
import cssStyles from './divider.module.css';

export interface DividerProps extends SystemProps, AsProp {
  vertical?: boolean;
}

export const Divider: AsComponent<'div', DividerProps> = React.forwardRef<
  HTMLDivElement,
  DividerProps
>(({ as, className, vertical, ...props }, ref) => {
  const classes = makeStyles(props);
  const rest = omitStyles(props);
  const Component = as || 'hr';
  return (
    <Component
      ref={ref}
      className={styleNames(cssStyles.divider, className, classes, {
        [cssStyles.vertical]: vertical,
      })}
      {...rest}
    ></Component>
  );
});
