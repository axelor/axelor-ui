import { Box } from "../box";
import { Icon } from "../icon";
import { IconProps } from "../icon/icon";
import styled, { withStyled } from "../styled";
import styles from "./menu.module.css";

export interface MenuItemProps {
  text?: string;
  label?: string;
  startIcon?: IconProps["as"];
  endIcon?: IconProps["as"];
  active?: boolean;
  disabled?: boolean;
}

const MenuItemBase = styled.button<MenuItemProps>(
  ({ active, disabled }) => [
    "dropdown-item",
    styles.menuItem,
    { active, disabled },
  ],
  ({ disabled, tabIndex }) =>
    disabled ? { tabIndex: -1, "aria-disabled": true } : { tabIndex },
);

export const MenuItem = withStyled(MenuItemBase)((
  { startIcon, endIcon, text, label, children, ...props },
  ref,
) => {
  return (
    <MenuItemBase {...props} ref={ref}>
      <Box d="flex" alignItems="center">
        {startIcon && <Icon as={startIcon} me={1} size="sm" />}
        <Box d="inline-flex" flexGrow={1} style={{ minWidth: 0 }}>
          {children || text}
        </Box>
        {label && <Box d="inline-flex">{label}</Box>}
        {endIcon && <Icon as={endIcon} float="end" ms={1} size="sm" />}
      </Box>
    </MenuItemBase>
  );
});
