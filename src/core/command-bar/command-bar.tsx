import { useCallback, useState } from "react";
import { MaterialIcon, MaterialIconProps } from "../../icons/meterial-icon";
import { Box } from "../box";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Image } from "../image";
import { Menu, MenuDivider, MenuItem } from "../menu";
import { clsx, useClassNames } from "../styles";

import styles from "./command-bar.module.scss";

export interface CommandItemProps {
  key: string;
  text?: string;
  subtext?: string;
  description?: string;
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
  render?: (props: CommandItemProps) => JSX.Element | null;
}

export interface CommandBarProps {
  items: CommandItemProps[];
  className?: string;
  iconProps?: Omit<MaterialIconProps, "icon">;
  iconOnly?: boolean;
}

export function CommandItem(props: CommandItemProps) {
  const {
    text,
    description,
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
  } = props;
  const classNames = useClassNames();
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const handleClick = useCallback(
    (e: any) => {
      if (onClick) onClick(e);
    },
    [onClick]
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
      if (menu.onClick) menu.onClick(e);
    },
    [hideMenu]
  );

  if (hidden) {
    return null;
  }

  if (render) {
    return render({ ...props, render: undefined });
  }

  if (divider) {
    return <hr className={styles.divider} />;
  }

  const isSplit = onClick && items.length > 0;
  const Wrapper = isSplit ? ButtonGroup : Box;

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
    <Wrapper className={styles.itemWrapper}>
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
            })
          )}
          disabled={disabled}
          {...buttonProps}
        >
          <span
            className={clsx(styles.title, {
              [styles.iconEnd]: iconSide === "end",
            })}
          >
            {imageProps && <Image className={styles.image} {...imageProps} />}
            {Icon ? (
              <Icon className={styles.icon} />
            ) : (
              iconProps && (
                <MaterialIcon {...iconProps} className={styles.icon} />
              )
            )}
            {text && !iconOnly && <span className={styles.title}>{text}</span>}
            {showArrow && <MaterialIcon icon="arrow_drop_down" />}
          </span>
        </Button>
      )}
      {isSplit && (
        <Button
          variant="light"
          className={clsx(styles.item, styles.split, { [styles.open]: show })}
          disabled={disabled}
          {...splitProps}
        >
          <MaterialIcon icon="arrow_drop_down" className={styles.icon} />
        </Button>
      )}
      {items.length > 0 && (
        <Menu
          target={target}
          show={show}
          onHide={hideMenu}
          rounded={false}
          className={styles.menu}
        >
          {items.map((item) => {
            const { key, divider, hidden, disabled, text, subtext } = item;

            if (hidden) {
              return null;
            }

            if (divider) {
              return <MenuDivider key={key} />;
            }

            return (
              <MenuItem
                key={key}
                disabled={disabled}
                onClick={(e) => handleMenuClick(e, item)}
              >
                {subtext ? (
                  <div className={styles.menuTexts}>
                    <span className={styles.menuTitle}>{text}</span>
                    <span className={styles.menuSub}>{subtext}</span>
                  </div>
                ) : (
                  <span className={styles.menuTitle}>{text}</span>
                )}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </Wrapper>
  );
}

export function CommandBar(props: CommandBarProps) {
  const { className, iconOnly, iconProps = {}, items = [] } = props;
  const { weight, grade, fill, opticalSize } = iconProps;

  const style = {
    "--ax-material-icon-fill": fill,
    "--ax-material-icon-wght": weight,
    "--ax-material-icon-grad": grade,
    "--ax-material-icon-opsz": opticalSize,
    "--ax-material-icon-fnsz": opticalSize ? `${opticalSize}px` : undefined,
  };

  return (
    <div className={clsx(className, styles.bar)} style={style as any}>
      {items.map((item) => (
        <CommandItem iconOnly={iconOnly} {...item} />
      ))}
    </div>
  );
}
