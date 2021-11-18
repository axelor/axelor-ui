import { forwardRef } from 'react';
import { styleNames } from '../styles';
import {
  makeStyles,
  omitStyles,
  SystemProps,
  OverridableComponent,
  OverridableProps,
} from '../system';
import cssStyles from './menu.module.css';

export interface MenuItemProps extends SystemProps, OverridableProps {
  disabled?: boolean;
  active?: boolean;
  href?: string;
}

export const MenuItem: OverridableComponent<'div', MenuItemProps> =
  forwardRef<HTMLAnchorElement, MenuItemProps>(
    ({ as, disabled, active, className, ...props }, ref) => {
      const styles = makeStyles(props);
      const rest = omitStyles(props);
      const classes = styleNames(
        className,
        cssStyles.menuItem,
        'dropdown-item',
        {
          active,
          disabled,
        },
        styles
      );
      const Component = as || 'a';
      return (
        <Component
          ref={ref}
          {...(disabled
            ? {
                'tabindex': -1,
                'aria-disabled': true,
              }
            : {
                tabIndex: 1,
              })}
          className={classes}
          {...rest}
        ></Component>
      );
    }
  );
