import { forwardRef } from 'react';
  
import { Box } from '../box';
import { Icon } from '../icon';
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
  text?: string;
  startIcon?: string;
  endIcon?: string;
  label?: string;
  disabled?: boolean;
  active?: boolean;
  href?: string;
}

export const MenuItem: OverridableComponent<'div', MenuItemProps> = forwardRef<
  HTMLAnchorElement,
  MenuItemProps
>(
  (
    {
      as,
      disabled,
      active,
      className,
      text,
      startIcon,
      endIcon,
      label,
      children,
      ...props
    },
    ref
  ) => {
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

    const content = (
      <Box d="flex" alignItems="center">
        {startIcon && <Box as={Icon} me={1} use={startIcon} size="sm" />}
        <Box d="inline-flex" flexGrow={1}>
          {children || text}
        </Box>
        {label && <Box d="inline-flex">{label}</Box>}
        {endIcon && (
          <Box as={Icon} float="end" ms={1} use={endIcon} size="sm" />
        )}
      </Box>
    );

    return (
      <Component
        ref={ref}
        {...(disabled
          ? {
              tabIndex: -1,
              'aria-disabled': true,
            }
          : {
              tabIndex: 1,
            })}
        className={classes}
        {...rest}
      >
        {content}
      </Component>
    );
  }
);
