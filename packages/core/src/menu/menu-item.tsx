import { Box } from '../box';
import { Icon } from '../icon';
import styled, { withStyled } from '../styled';
import styles from './menu.module.css';

export interface MenuItemProps {
  text?: string;
  label?: string;
  startIcon?: string;
  endIcon?: string;
  disabled?: boolean;
  active?: boolean;
}

const MenuItemBase = styled.a<MenuItemProps>(
  ({ active, disabled }) => [
    'dropdown-item',
    styles.menuItem,
    { active, disabled },
  ],
  ({ disabled, tabIndex = 1 }) =>
    disabled ? { tabIndex: -1, 'aria-disabled': true } : { tabIndex }
);

export const MenuItem = withStyled(MenuItemBase)(
  ({ startIcon, endIcon, text, label, children, ...props }, ref) => {
    return (
      <MenuItemBase {...props} ref={ref}>
        <Box d="flex" alignItems="center">
          {startIcon && <Icon use={startIcon} me={1} size="sm" />}
          <Box d="inline-flex" flexGrow={1}>
            {children || text}
          </Box>
          {label && <Box d="inline-flex">{label}</Box>}
          {endIcon && <Icon use={endIcon} float="end" ms={1} size="sm" />}
        </Box>
      </MenuItemBase>
    );
  }
);
