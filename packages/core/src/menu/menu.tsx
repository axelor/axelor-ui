import React from 'react';

import { styleNames } from '../styles';
import {
  OverridableComponent,
  OverridableProps,
  makeStyles,
  omitStyles,
} from '../system';
import { Popper, PopperProps } from '../popper/popper';
import { ClickAwayListener } from '../click-away-listener';
import { ArrowNavigation } from '../arrow-navigation';
import { FocusTrap } from '../focus-trap';

export type MenuPlacement = 'top' | 'bottom' | 'start' | 'end';
export type MenuAlignment = 'top' | 'bottom' | 'start' | 'end';

export interface MenuProps
  extends Omit<PopperProps, 'shadow' | 'children'>,
    OverridableProps {
  placement?: MenuPlacement;
  alignment?: MenuAlignment;
  flip?: boolean;
  show?: boolean;
  shadow?: boolean | string;
  onHide?: any;
  className?: string;
  children?: React.ReactElement | Array<React.ReactElement>;
}

export const Menu: OverridableComponent<'div', MenuProps> = React.forwardRef<
  HTMLDivElement,
  MenuProps
>(
  (
    {
      as,
      flip,
      show,
      onHide,
      container = document.body,
      target,
      placement = 'bottom',
      alignment = 'start',
      className,
      ...props
    },
    ref
  ) => {
    const classes = makeStyles(props);
    const rest = omitStyles(props);
    const Component = as || 'div';
    const $placement: any = `${placement}-${alignment}`;

    return (
      <Popper placement={$placement} target={target} open={show}>
        <ClickAwayListener onClickAway={onHide}>
          <FocusTrap>
            <ArrowNavigation selector="auto-vertical">
              <Component
                ref={ref}
                className={styleNames(
                  className,
                  'dropdown-menu',
                  {
                    show,
                    [`dropdown-menu-${placement}`]: placement,
                  },
                  classes
                )}
                {...rest}
              ></Component>
            </ArrowNavigation>
          </FocusTrap>
        </ClickAwayListener>
      </Popper>
    );
  }
);
