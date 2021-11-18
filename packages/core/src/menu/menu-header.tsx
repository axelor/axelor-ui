import { forwardRef } from 'react';
import { styleNames } from '../styles';
import {
  makeStyles,
  omitStyles,
  SystemProps,
  OverridableComponent,
  OverridableProps,
} from '../system';

export interface MenuHeaderProps extends SystemProps, OverridableProps {}

export const MenuHeader: OverridableComponent<'div', MenuHeaderProps> =
  forwardRef<HTMLDivElement, MenuHeaderProps>(
    ({ as, className, ...props }, ref) => {
      const styles = makeStyles(props);
      const rest = omitStyles(props);
      const classes = styleNames(className, 'dropdown-header', styles);
      const Component = as || 'div';
      return (
        <Component
          ref={ref}
          className={classes}
          aria-disabled="true"
          {...rest}
          {...props}
        ></Component>
      );
    }
  );
