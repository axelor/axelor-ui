import { Box } from "../box";
import { Icon } from "../icon";
import { IconProps } from "../icon/icon";
import styled, { withStyled } from "../styled";
import { findDataProp, makeTestId } from "../system/utils";

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
          <Icon
            as={startIcon}
            me={1}
            size="sm"
            data-testid={makeTestId(testId, "start-icon")}
          />
        )}
        <Box d="inline-flex" flexGrow={1} style={{ minWidth: 0 }}>
          {children || text}
        </Box>
        {label && <Box d="inline-flex">{label}</Box>}
        {endIcon && (
          <Icon
            as={endIcon}
            float="end"
            ms={1}
            size="sm"
            data-testid={makeTestId(testId, "end-icon")}
          />
        )}
      </Box>
    </MenuItemBase>
  );
});
