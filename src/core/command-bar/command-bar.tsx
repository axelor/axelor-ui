import { Fragment, JSX, useCallback, useId, useMemo, useState } from "react";
import { MaterialIcon, MaterialIconProps } from "../../icons/material-icon";
import { Button, ButtonProps } from "../button";
import { ButtonGroup } from "../button-group";
import { clsx } from "../clsx";
import { Image } from "../image";
import { Menu, MenuDivider, MenuItem } from "../menu";
import { useClassNames } from "../styles";
import { findAriaProp, findDataProp, makeTestId } from "../system/utils";

import styles from "./command-bar.module.scss";

export interface CommandItemProps {
  key: string;
  text?: string;
  subtext?: string;
  description?: string;
  variant?: ButtonProps["variant"];
  menuProps?: { arrow?: boolean; rounded?: boolean; contentClassName?: string };
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
  onDoubleClick?: React.EventHandler<
    React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>
  >;
  items?: CommandItemProps[];
  showDownArrow?: boolean;
  showAsMenuItem?: boolean;
  className?: string;
  render?: (props: RenderCommandItemProps) => JSX.Element | null;
}

export type RenderCommandItemProps = Omit<CommandItemProps, "key">;

export interface CommandBarProps {
  items: CommandItemProps[];
  className?: string;
  menuProps?: { arrow?: boolean; rounded?: boolean; contentClassName?: string };
  iconProps?: Omit<MaterialIconProps, "icon">;
  iconOnly?: boolean;
}

export function CommandItem(props: RenderCommandItemProps) {
  const {
    text,
    subtext,
    description,
    variant = "light",
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
    onDoubleClick,
    onClick,
    items = [],
    showDownArrow = false,
    showAsMenuItem,
    className,
  } = props;
  const classNames = useClassNames();
  const testId = findDataProp(props, "data-testid");
  const ariaLabel = findAriaProp(props, "aria-label");
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-desc`;
  const subtextId = `${baseId}-subtext`;
  const menuId = `${baseId}-menu`;

  const ariaHaspopup =
    findAriaProp(props, "aria-haspopup") ||
    (items.length > 0 ? "menu" : undefined);

  const ariaExpanded =
    findAriaProp(props, "aria-expanded") ||
    (items.length > 0 ? show : undefined);

  const ariaControls =
    findAriaProp(props, "aria-controls") ||
    (items.length > 0 ? menuId : undefined);

  const handleClick = useCallback(
    (e: any) => {
      if (e.detail === 2) {
        onDoubleClick?.(e);
      } else {
        onClick?.(e);
      }
    },
    [onDoubleClick, onClick],
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
      if (e.detail === 2) {
        menu.onDoubleClick?.(e);
      } else {
        menu.onClick?.(e);
      }
    },
    [showAsMenuItem, hideMenu, handleClick],
  );

  const allItemsHidden = useMemo(
    () => items.length > 0 && items.filter((item) => !item.hidden).length === 0,
    [items],
  );

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

  if (hidden || allItemsHidden) {
    return null;
  }

  if (render) {
    const RenderItem = render;
    return <RenderItem {...props} render={undefined} />;
  }

  if (divider) {
    return <hr className={styles.divider} />;
  }

  return (
    <>
      {showAsMenuItem ? (
        <MenuItem
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={text ? titleId : undefined}
          aria-describedby={subtext ? subtextId : undefined}
          aria-haspopup={ariaHaspopup}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          aria-pressed={checked ? true : undefined}
          {...buttonProps}
          data-testid={testId}
        >
          {subtext ? (
            <div className={styles.menuTexts}>
              <span id={titleId} className={styles.menuTitle}>
                {text}
              </span>
              <span id={subtextId} className={styles.menuSub}>
                {subtext}
              </span>
            </div>
          ) : (
            <span id={titleId} className={styles.menuTitle}>
              {text}
            </span>
          )}
          {items?.length > 0 && (
            <span className={styles.menuItemIcon}>
              <MaterialIcon
                icon="arrow_right"
                className={styles.icon}
                aria-hidden="true"
              />
            </span>
          )}
        </MenuItem>
      ) : (
        <Wrapper
          className={clsx(styles.itemWrapper, className)}
          data-testid={testId}
        >
          {hasContent && (
            <Button
              variant={variant}
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
              data-testid={makeTestId(testId, "button")}
              aria-label={
                ariaLabel || (iconOnly && !text ? description : undefined)
              }
              aria-labelledby={text && !iconOnly ? titleId : undefined}
              aria-describedby={description ? descriptionId : undefined}
              aria-haspopup={ariaHaspopup}
              aria-expanded={ariaExpanded}
              aria-controls={ariaControls}
              aria-pressed={checked ? true : undefined}
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
                  <span id={titleId} className={styles.titleText}>
                    {text}
                  </span>
                )}
                {showArrow && (
                  <MaterialIcon
                    icon="arrow_drop_down"
                    className={clsx(styles.icon, styles.arrowIcon)}
                    aria-hidden="true"
                  />
                )}
              </span>
            </Button>
          )}
          {isSplit && (
            <Button
              variant={variant}
              className={clsx(styles.item, styles.split, {
                [styles.open]: show,
              })}
              disabled={disabled}
              tabIndex={0}
              data-testid={makeTestId(testId, "split")}
              aria-label={`${text || ""} menu`}
              aria-labelledby={text ? titleId : undefined}
              aria-haspopup="menu"
              aria-expanded={show}
              aria-controls={menuId}
              {...splitProps}
            >
              <span className={styles.title}>
                <MaterialIcon
                  icon="arrow_drop_down"
                  className={clsx(styles.icon, styles.arrowIcon)}
                  aria-hidden="true"
                />
              </span>
            </Button>
          )}
        </Wrapper>
      )}
      {items.length > 0 && (
        <Menu
          id={menuId}
          target={target}
          show={show}
          onHide={hideMenu}
          className={styles.menu}
          data-testid={makeTestId(testId, "menu")}
          aria-label={ariaLabel}
          {...menuProps}
          {...(showAsMenuItem && {
            placement: "end-top",
          })}
        >
          {items.map((itemProp) => {
            const { key, ...item } = itemProp;
            const { divider, hidden, render: Render } = item;

            if (hidden) {
              return null;
            }

            if (divider) {
              return <MenuDivider key={key} />;
            }

            const itemProps = {
              ...item,
              showAsMenuItem: true,
              onClick: (e: any) => handleMenuClick(e, itemProp),
            };

            if (Render) {
              return (
                <Fragment key={key}>
                  <Render
                    {...itemProps}
                    render={undefined}
                    data-testid={makeTestId(testId, "item", key)}
                  />
                </Fragment>
              );
            }

            return (
              <CommandItem
                key={key}
                {...itemProps}
                data-testid={makeTestId(testId, "item", key)}
              />
            );
          })}
        </Menu>
      )}
    </>
  );
}

export function CommandBar(props: CommandBarProps) {
  const { className, iconOnly, iconProps = {}, items = [] } = props;
  const testId = findDataProp(props, "data-testid");
  const ariaLabel = findAriaProp(props, "aria-label");
  return (
    <div
      className={clsx(className, styles.bar)}
      data-testid={testId}
      role="toolbar"
      aria-label={ariaLabel}
    >
      {items.map(({ key, iconProps: icon, menuProps, ...item }) => (
        <CommandItem
          key={key}
          iconOnly={iconOnly}
          iconProps={{ ...iconProps, ...icon } as MaterialIconProps}
          menuProps={{
            ...props.menuProps,
            ...menuProps,
          }}
          data-testid={makeTestId(testId, "item", key)}
          {...item}
        />
      ))}
    </div>
  );
}
