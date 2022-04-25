import { ArrowNavigation } from '../arrow-navigation';

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

export const Menu = withStyled(MenuContent)(
  (
    {
      flip,
      show,
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
    return (
      <Popper
        placement={placement}
        target={target!}
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
    );
  }
);
