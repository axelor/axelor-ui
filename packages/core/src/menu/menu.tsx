import * as React from 'react';

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
import cssStyles from './menu.module.css';
import { Button } from '../button';

export type MenuPlacement = 'top' | 'bottom' | 'start' | 'end';
export type MenuAlignment = 'top' | 'bottom' | 'start' | 'end';

export interface MenuProps
  extends Omit<PopperProps, 'shadow' | 'children' | 'target'>,
    OverridableProps {
  target?: HTMLElement | null;
  placement?: MenuPlacement;
  alignment?: MenuAlignment;
  flip?: boolean;
  show?: boolean;
  shadow?: boolean | string;
  text?: string;
  onShow?: any;
  onHide?: any;
  className?: string;
  disablePortal?: boolean;
  navigation?: boolean;
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
      text,
      onShow,
      onHide,
      container = document.body,
      target,
      placement = 'bottom',
      alignment = '',
      className,
      disablePortal,
      offset,
      navigation,
      ...props
    },
    ref
  ) => {
    const classes = makeStyles(props);
    const rest = omitStyles(props);
    const Component = as || 'div';
    const $placement: any = `${placement}${alignment ? `-${alignment}` : ''}`;

    const [buttonRef, setButtonRef] = React.useState<any>(null);

    const content = (
      <Component
        ref={ref}
        className={styleNames(
          className,
          cssStyles.dropdownMenu,
          'dropdown-menu',
          {
            show,
            [`dropdown-menu-${placement}`]: placement,
          },
          classes
        )}
        {...rest}
      ></Component>
    );

    return (
      <>
        {text && (
          <Button
            ref={setButtonRef}
            onClick={onShow}
            {...(show ? { variant: 'light' } : {})}
          >
            {text}
          </Button>
        )}
        <Popper
          placement={$placement}
          target={target || buttonRef}
          open={show}
          offset={offset}
          disablePortal={disablePortal}
        >
          <ClickAwayListener onClickAway={onHide}>
            {navigation ? (
              <FocusTrap>
                <ArrowNavigation selector="auto-vertical">
                  {content}
                </ArrowNavigation>
              </FocusTrap>
            ) : (
              content
            )}
          </ClickAwayListener>
        </Popper>
      </>
    );
  }
);
