import React from "react";

import { ClickAwayListener } from "../click-away-listener";
import { Popper } from "../popper";
import { Collapse } from "../collapse";
import { Badge } from "../badge";
import { Box } from "../box";
import { MaterialIcon } from "../../icons/meterial-icon";
import { Nav } from "./nav";
import { NavItemProps, NavProps } from "./types";
import { useClassNames, useTheme } from "../styles";
import { getRGB, getSupportedColor } from "./utils";

import classes from "./nav-bar.module.scss";

export interface NavBarProps extends NavProps {
  float?: boolean;
}

export interface NavBarItemProps {
  float?: boolean;
  item: NavItemProps;
  active?: boolean;
  onClick?: NavProps["onClick"];
  onItemClick?: NavProps["onClick"];
}

const NavBarMenu = React.memo(function NavBarMenu({
  float,
  items,
  onClick,
}: NavBarProps) {
  const [active, setActive] = React.useState<string | null>(null);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>, item: NavItemProps) => {
      if (!item.items) {
        setActive(null);
      }
      onClick && onClick(e, item);
    },
    [onClick]
  );

  const handleItemClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>, item: NavItemProps) => {
      setActive(item.id);
      onClick && onClick(e, item);
    },
    [onClick]
  );

  return (
    <Box className={classes.menu}>
      {(items || []).map((item) => (
        <NavBarItem
          key={item.id}
          float={float}
          active={item.id === active}
          item={item}
          onClick={handleItemClick}
          onItemClick={float ? handleClick : onClick}
        />
      ))}
    </Box>
  );
});

const NavBarItem = React.memo(function NavBarItem({
  active,
  float,
  item,
  onClick,
  onItemClick,
}: NavBarItemProps) {
  const [expand, setExpand] = React.useState(false);
  const [targetEl, setTargetEl] = React.useState<HTMLElement | null>(null);
  const classNames = useClassNames();
  const rtl = useTheme().dir === "rtl";

  const { tag, tagStyle, icon, iconColor, title, items } = item;
  const color = iconColor && getSupportedColor(iconColor);
  const bgColor = color && getRGB(color, 0.25);
  const hasChildren = (items || []).length > 0;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    onClick && onClick(e, item);
    setExpand(!expand);
  }

  function renderMenu() {
    const children = (
      <Box
        className={classNames(classes.menuItemChildren, {
          [classes.float]: float,
        })}
      >
        <NavBarMenu items={items} onClick={onItemClick} />
      </Box>
    );

    if (float) {
      return (
        <Popper
          open={expand}
          target={targetEl}
          offset={[-4, 0]}
          placement="end-top"
          rounded={false}
        >
          <ClickAwayListener onClickAway={() => setExpand(false)}>
            <Box
              className={classNames("nav-popper", {
                [classes.rtl]: rtl,
              })}
              {...(rtl ? { dir: "rtl" } : {})}
            >
              {children}
            </Box>
          </ClickAwayListener>
        </Popper>
      );
    }

    return (
      <Collapse in={expand} unmountOnExit={!active}>
        {children}
      </Collapse>
    );
  }

  React.useEffect(() => {
    float && setExpand(false);
  }, [float]);

  React.useEffect(() => {
    !active && setExpand(false);
  }, [active]);

  return (
    <Box
      className={classNames(classes.menuItemWrapper, {
        [classes.active]: active,
      })}
      {...(active
        ? { style: { borderColor: color && getRGB(color, 0.5) } }
        : {})}
    >
      <Box
        d="flex"
        alignItems="center"
        ref={setTargetEl}
        className={classNames(classes.menuItem, {
          [classes.active]: active,
          [classes.float]: float,
          [classes["has-children"]]: hasChildren,
        })}
        onClick={handleClick}
      >
        <Box
          className={classes.menuItemIcon}
          d="flex"
          justifyContent="center"
          alignItems="center"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {icon && icon({ color })}
        </Box>

        <Box flex={1} className={classes.menuItemTitle}>
          {title}
        </Box>

        {tag && (
          <Badge
            className={classNames(classes.menuTag, {
              [classes.hasMenuIcon]: hasChildren,
            })}
            data-tag-name={item.id}
            bg={(tagStyle || "secondary") as any}
          >
            {`${tag}`.toUpperCase()}
          </Badge>
        )}

        {hasChildren && (
          <Box
            d="flex"
            className={classNames(classes.menuIcon, {
              [classes.expand]: expand,
            })}
          >
            <MaterialIcon icon="arrow_left" variant="sharp" />
          </Box>
        )}
      </Box>

      {hasChildren && renderMenu()}
    </Box>
  );
});

export const NavBar: React.FC<NavBarProps> = (props) => {
  const classNames = useClassNames();
  const rtl = useTheme().dir === "rtl";

  return (
    <Box
      className={classNames("nav-bar", classes.root, {
        [classes.rtl]: rtl,
      })}
    >
      <Nav {...props} onRender={(props) => <NavBarMenu {...props} />} />
    </Box>
  );
};
