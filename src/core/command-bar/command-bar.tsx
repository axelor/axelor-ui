import { useCallback, useMemo, useState } from "react";
import { MaterialIcon, MaterialIconProps } from "../../icons/material-icon";
import { Box } from "../box";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { clsx } from "../clsx";
import { Image } from "../image";
import { Menu, MenuDivider, MenuItem } from "../menu";
import { useClassNames } from "../styles";

import styles from "./command-bar.module.scss";

export interface CommandItemProps {
  key: string;
  text?: string;
  subtext?: string;
  description?: string;
  menuProps?: { arrow?: boolean; rounded?: boolean };
  imageProps?: {
    src: string;
    alt: string;
  };
  icon?: (props?: { className?: string }) => JSX.Element | null;
  iconProps?: MaterialIconProps;
  iconOnly?: boolean;
  iconSide?: "start" | "end";
  disabled?: boolean;
  checked?: boolean;
  divider?: boolean;
  hidden?: boolean;
  onClick?: React.EventHandler<
    React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>
  >;
  items?: CommandItemProps[];
  showDownArrow?: boolean;
  showAsMenuItem?: boolean;
  className?: string;
  render?: (props: CommandItemProps) => JSX.Element | null;
}

export interface CommandBarProps {
  items: CommandItemProps[];
  className?: string;
  menuProps?: { arrow?: boolean; rounded?: boolean };
  iconProps?: Omit<MaterialIconProps, "icon">;
  iconOnly?: boolean;
}

export function CommandItem(props: CommandItemProps) {
  const {
    text,
    subtext,
    description,
    menuProps,
    imageProps,
    icon: Icon,
    iconProps,
    iconSide,
    iconOnly,
    checked,
    disabled,
    divider,
    hidden,
    render,
    onClick,
    items = [],
    showDownArrow = false,
    showAsMenuItem,
    className,
  } = props;
  const classNames = useClassNames();
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const handleClick = useCallback(
    (e: any) => {
      if (onClick) onClick(e);
    },
    [onClick],
  );

  const showMenu = useCallback(() => {
    setShow(true);
  }, []);

  const hideMenu = useCallback(() => {
    setShow(false);
  }, []);

  const handleMenuClick = useCallback(
    (e: any, menu: CommandItemProps) => {
      hideMenu();
      if (showAsMenuItem) handleClick(e);
      if (menu.onClick) menu.onClick(e);
    },
    [showAsMenuItem, hideMenu, handleClick],
  );

  const allItemsHidden = useMemo(
    () => items.length > 0 && items.filter((item) => !item.hidden).length === 0,
    [items],
  );

  if (hidden || allItemsHidden) {
    return null;
  }

  if (render) {
    return render({ ...props, render: undefined });
  }

  if (divider) {
    return <hr className={styles.divider} />;
  }

  const isSplit = onClick && items.length > 0 && !showAsMenuItem;
  const Wrapper = ButtonGroup;

  const showArrow = showDownArrow && !isSplit && items.length > 0;

  const buttonProps =
    isSplit || items.length === 0
      ? {
          onClick: handleClick,
        }
      : {
          ref: setTarget,
          onClick: showMenu,
        };

  const splitProps = {
    ref: setTarget,
    onClick: showMenu,
  };

  const hasContent = imageProps || Icon || iconProps || text || showArrow;
  return (
    <>
      {showAsMenuItem ? (
        <MenuItem disabled={disabled} {...buttonProps}>
          {subtext ? (
            <div className={styles.menuTexts}>
              <span className={styles.menuTitle}>{text}</span>
              <span className={styles.menuSub}>{subtext}</span>
            </div>
          ) : (
            <span className={styles.menuTitle}>{text}</span>
          )}
          {items?.length > 0 && (
            <span className={styles.menuItemIcon}>
              <MaterialIcon icon="arrow_right" className={styles.icon} />
            </span>
          )}
        </MenuItem>
      ) : (
        <Wrapper className={clsx(styles.itemWrapper, className)}>
          {hasContent && (
            <Button
              variant="light"
              title={description}
              className={clsx(
                styles.item,
                {
                  [styles.open]: show && !isSplit && items.length > 0,
                },
                classNames({
                  active: checked,
                }),
              )}
              disabled={disabled}
              {...buttonProps}
            >
              <span
                className={clsx(styles.title, {
                  [styles.iconEnd]: iconSide === "end",
                })}
              >
                {imageProps?.src && (
                  <Image className={styles.image} {...imageProps} />
                )}
                {Icon ? (
                  <Icon className={styles.icon} />
                ) : (
                  iconProps?.icon && (
                    <MaterialIcon {...iconProps} className={styles.icon} />
                  )
                )}
                {text && !iconOnly && (
                  <span className={styles.titleText}>{text}</span>
                )}
                {showArrow && (
                  <MaterialIcon
                    icon="arrow_drop_down"
                    className={clsx(styles.icon, styles.arrowIcon)}
                  />
                )}
              </span>
            </Button>
          )}
          {isSplit && (
            <Button
              variant="light"
              className={clsx(styles.item, styles.split, {
                [styles.open]: show,
              })}
              disabled={disabled}
              {...splitProps}
            >
              <span className={styles.title}>
                <MaterialIcon
                  icon="arrow_drop_down"
                  className={clsx(styles.icon, styles.arrowIcon)}
                />
              </span>
            </Button>
          )}
        </Wrapper>
      )}
      {items.length > 0 && (
        <Menu
          target={target}
          show={show}
          onHide={hideMenu}
          className={styles.menu}
          {...menuProps}
          {...(showAsMenuItem && {
            placement: "end-top",
          })}
        >
          {items.map((item) => {
            const { key, divider, hidden, render } = item;

            if (hidden) {
              return null;
            }

            if (divider) {
              return <MenuDivider key={key} />;
            }

            const itemProps = {
              ...item,
              showAsMenuItem: true,
              onClick: (e: any) => handleMenuClick(e, item),
            };

            if (render) {
              return render({ ...itemProps, render: undefined });
            }

            return <CommandItem {...itemProps} />;
          })}
        </Menu>
      )}
    </>
  );
}

export function CommandBar(props: CommandBarProps) {
  const { className, iconOnly, iconProps = {}, items = [] } = props;
  return (
    <div className={clsx(className, styles.bar)}>
      {items.map(({ iconProps: icon, menuProps, ...item }) => (
        <CommandItem
          iconOnly={iconOnly}
          iconProps={{ ...iconProps, ...icon } as MaterialIconProps}
          menuProps={{
            ...props.menuProps,
            ...menuProps,
          }}
          {...item}
        />
      ))}
    </div>
  );
}
