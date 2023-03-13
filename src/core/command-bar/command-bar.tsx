import { useCallback, useState } from "react";
import { MaterialIcon, MaterialIconProps } from "../../icons/meterial-icon";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { Menu, MenuItem } from "../menu";
import { clsx } from "../styles";

import styles from "./command-bar.module.scss";

export interface CommandItemProps {
  id: string;
  title?: string;
  iconProps?: MaterialIconProps;
  onClick?: React.EventHandler<
    React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>
  >;
  items?: CommandItemProps[];
}

export interface CommandBarProps {
  items: CommandItemProps[];
  className?: string;
}

function CommandItem(props: CommandItemProps) {
  const { title, iconProps, onClick, items = [] } = props;

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

  // split button
  if (onClick && items.length) {
    return (
      <ButtonGroup>
        <Button variant="light" className={styles.item} onClick={handleClick}>
          <span>
            {iconProps && (
              <MaterialIcon {...iconProps} className={styles.icon} />
            )}
            {title && <span className={styles.title}>{title}</span>}
          </span>
        </Button>
        <Button
          variant="light"
          className={clsx(styles.item, styles.split, { [styles.open]: show })}
          ref={setTarget}
          onClick={showMenu}
        >
          <MaterialIcon icon="arrow_drop_down" className={styles.icon} />
        </Button>
        <Menu
          target={target}
          show={show}
          onHide={hideMenu}
          rounded={false}
          className={styles.menu}
        >
          {items.map((x) => (
            <MenuItem key={x.id}>{x.title}</MenuItem>
          ))}
        </Menu>
      </ButtonGroup>
    );
  }

  return (
    <Button variant="light" className={styles.item} onClick={handleClick}>
      <span>
        {iconProps && <MaterialIcon {...iconProps} className={styles.icon} />}
        {title && <span className={styles.title}>{title}</span>}
      </span>
    </Button>
  );
}

export function CommandBar(props: CommandBarProps) {
  const { items = [] } = props;
  return (
    <div className={styles.bar}>
      {items.map((item) => (
        <CommandItem key={item.id} {...item} />
      ))}
    </div>
  );
}
