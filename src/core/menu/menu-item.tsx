import { Box } from "../box";
import styled, { withStyled } from "../styled";
import { findDataProp, makeTestId } from "../system/utils";

import styles from "./menu.module.css";

export interface MenuItemProps {
  text?: string;
  label?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

const MenuItemBase = styled.button<MenuItemProps>(
  ({ active, disabled }) => [
    "dropdown-item",
    styles.menuItem,
    { active, disabled },
  ],
  ({ disabled, tabIndex }) => ({
    role: "menuitem",
    tabIndex: disabled ? -1 : tabIndex,
    "aria-disabled": disabled || undefined,
  }),
);

export const MenuItem = withStyled(MenuItemBase)((
  { startIcon, endIcon, text, label, children, ...props },
  ref,
) => {
  const testId = findDataProp(props, "data-testid");
  return (
    <MenuItemBase {...props} ref={ref}>
      <Box d="flex" alignItems="center">
        {startIcon && (
          <Box
            as="span"
            d="inline-flex"
            me={1}
            className={styles.menuItemIcon}
            data-testid={makeTestId(testId, "start-icon")}
          >
            {startIcon}
          </Box>
        )}
        <Box d="inline-flex" flexGrow={1} style={{ minWidth: 0 }}>
          {children || text}
        </Box>
        {label && <Box d="inline-flex">{label}</Box>}
        {endIcon && (
          <Box
            as="span"
            d="inline-flex"
            ms={1}
            className={styles.menuItemIcon}
            data-testid={makeTestId(testId, "end-icon")}
          >
            {endIcon}
          </Box>
        )}
      </Box>
    </MenuItemBase>
  );
});
