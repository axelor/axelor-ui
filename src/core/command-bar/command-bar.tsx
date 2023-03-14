import { useCallback, useState } from "react";
import { MaterialIcon, MaterialIconProps } from "../../icons/meterial-icon";
import { Box } from "../box";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Menu, MenuItem } from "../menu";
import { clsx, useClassNames } from "../styles";

import styles from "./command-bar.module.scss";

export interface CommandItemProps {
  id: string;
  title?: string;
  help?: string;
  iconProps?: MaterialIconProps;
  iconOnly?: boolean;
  iconSide?: "start" | "end";
  disabled?: boolean;
  checked?: boolean;
  onClick?: React.EventHandler<
    React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>
  >;
  items?: CommandItemProps[];
}

export interface CommandBarProps {
  items: CommandItemProps[];
  className?: string;
  iconProps?: Omit<MaterialIconProps, "icon">;
}

function CommandItem(props: CommandItemProps) {
  const {
    title,
    help,
    iconProps,
    iconSide,
    iconOnly,
    checked,
    disabled,
    onClick,
    items = [],
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

  const isSplit = onClick && items.length > 0;
  const Wrapper = isSplit ? ButtonGroup : Box;

  const moreProps = { ref: setTarget, onClick: showMenu };

  const buttonProps = isSplit ? {} : moreProps;
  const splitProps = isSplit ? moreProps : {};

  return (
    <Wrapper>
      <Button
        variant="light"
        title={help}
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
        onClick={handleClick}
        {...buttonProps}
      >
        <span
          className={clsx(styles.title, {
            [styles.iconEnd]: iconSide === "end",
          })}
        >
          {iconProps && <MaterialIcon {...iconProps} className={styles.icon} />}
          {title && !iconOnly && <span className={styles.title}>{title}</span>}
        </span>
      </Button>
      {isSplit && (
        <Button
          variant="light"
          className={clsx(styles.item, styles.split, { [styles.open]: show })}
          ref={setTarget}
          disabled={disabled}
          onClick={showMenu}
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
          {items.map((item) => (
            <MenuItem key={item.id}>{item.title}</MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}

export function CommandBar(props: CommandBarProps) {
  const { className, iconProps = {}, items = [] } = props;
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
        <CommandItem key={item.id} {...item} />
      ))}
    </div>
  );
}
