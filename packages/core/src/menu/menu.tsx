import { useState } from 'react';
import { ArrowNavigation } from '../arrow-navigation';
import { Button } from '../button';
import { ClickAwayListener } from '../click-away-listener';
import { FocusTrap } from '../focus-trap';
import { Popper, PopperProps } from '../popper/popper';
import styled, { withStyled } from '../styled';
import styles from './menu.module.css';

export interface MenuProps
  extends Pick<
    PopperProps,
    'placement' | 'container' | 'offset' | 'arrow' | 'transition'
  > {
  target?: HTMLElement | null;
  flip?: boolean;
  show?: boolean;
  text?: string;
  onShow?: any;
  onHide?: any;
  disablePortal?: boolean;
  navigation?: boolean;
}

const MenuContent = styled.div<MenuProps>(({ show, placement }) => [
  styles.dropdownMenu,
  'dropdown-menu',
  {
    show,
    [`dropdown-menu-${placement}`]: placement,
  },
]);

const MenuButton = styled(Button)<MenuProps>(props => {
  return props.show ? { variant: 'light' } : {};
});

export const Menu = withStyled(MenuContent)(
  (
    {
      flip,
      show,
      text,
      onShow,
      onHide,
      container = document.body,
      target,
      placement = 'bottom-start',
      disablePortal,
      offset,
      navigation,
      arrow,
      transition,
      ...props
    },
    ref
  ) => {
    const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
    return (
      <>
        {text && (
          <MenuButton ref={setButtonRef} onClick={onShow} show={show}>
            {text}
          </MenuButton>
        )}
        <Popper
          placement={placement}
          target={target || buttonRef}
          open={show}
          offset={offset}
          disablePortal={disablePortal}
          arrow={arrow}
          transition={transition}
        >
          <ClickAwayListener onClickAway={onHide}>
            {navigation ? (
              <FocusTrap>
                <ArrowNavigation selector="auto-vertical">
                  <MenuContent
                    {...props}
                    show={show}
                    placement={placement}
                    ref={ref}
                  />
                </ArrowNavigation>
              </FocusTrap>
            ) : (
              <MenuContent
                {...props}
                show={show}
                placement={placement}
                ref={ref}
              />
            )}
          </ClickAwayListener>
        </Popper>
      </>
    );
  }
);
