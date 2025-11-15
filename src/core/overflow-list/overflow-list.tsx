import { JSX, forwardRef, useCallback, useId, useMemo, useState } from "react";

import { clsx } from "../clsx";
import { useRefs } from "../hooks";
import { Menu, MenuItem, MenuProps } from "../menu";
import {
  Overflow,
  OverflowItem,
  OverflowItemProps,
  OverflowProps,
  useIsOverflowItemVisible,
  useOverflowMenu,
} from "../overflow";

import { findAriaProp, findDataProp, makeTestId } from "../system/utils";
import styles from "./overflow-list.module.scss";

export interface OverflowListItem
  extends Pick<OverflowItemProps, "id" | "groupId" | "priority"> {}

export interface OverflowListItemProps<T extends OverflowListItem> {
  item: T;
  active?: boolean;
}

export interface OverflowMenuTriggerProps {
  count: number;
  open: boolean;
}

export interface OverflowListProps<T extends OverflowListItem> {
  items: T[];

  renderItem: (props: OverflowListItemProps<T>) => JSX.Element | null;
  renderMenuTrigger: (props: OverflowMenuTriggerProps) => JSX.Element | null;
  renderMenuItem: (props: OverflowListItemProps<T>) => JSX.Element | null;

  onItemClick?: (item: T) => void;
  isItemActive?: (item: T) => boolean;

  overflowProps?: Pick<OverflowProps, "overflowAxis" | "overflowDirection">;
  menuProps?: Pick<MenuProps, "arrow" | "rounded">;

  className?: string;
  style?: React.CSSProperties;
}

export const OverflowList = forwardRef<HTMLDivElement, OverflowListProps<any>>(
  (props, ref) => {
    const { style, className, items, overflowProps } = props;
    const testId = findDataProp(props, "data-testid");
    const ariaLabel = findAriaProp(props, "aria-label");
    return (
      <Overflow key={items.length} {...overflowProps} ref={ref}>
        <div
          className={clsx(styles.list, className, {
            [styles.vertical]: overflowProps?.overflowAxis === "vertical",
          })}
          style={style}
          data-testid={testId}
          role="list"
          aria-label={ariaLabel}
        >
          {items.map((item) => (
            <OverflowItem
              key={item.id}
              id={item.id}
              groupId={item.groupId}
              priority={item.priority}
            >
              <ListItem
                key={item.id}
                {...props}
                item={item}
                data-testid={makeTestId(testId, "item", item.id)}
              />
            </OverflowItem>
          ))}
          <ListMenu {...props} data-testid={makeTestId(testId, "menu")} />
        </div>
      </Overflow>
    );
  },
) as unknown as <T extends OverflowListItem>(
  props: OverflowListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement;

const ListItem = forwardRef<
  HTMLDivElement,
  OverflowListItemProps<any> & OverflowListProps<any>
>((props, ref) => {
  const { item, onItemClick, isItemActive, renderItem: Comp } = props;
  const testId = findDataProp(props, "data-testid");
  const isActive = isItemActive?.(item);

  const handleClick = useCallback(
    () => onItemClick?.(item),
    [item, onItemClick],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onItemClick?.(item);
      }
    },
    [item, onItemClick],
  );

  const renderProps = useMemo(
    () => ({ item, active: isActive }),
    [isActive, item],
  );

  return (
    <div
      data-testid={testId}
      className={styles.item}
      ref={ref}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="listitem"
      aria-selected={isActive}
      tabIndex={0}
    >
      <Comp {...renderProps} />
    </div>
  );
});

const ListMenuItem = (
  props: OverflowListItemProps<any> & OverflowListProps<any>,
) => {
  const { item, isItemActive, renderMenuItem: Comp, onItemClick } = props;
  const { id } = item;

  const testId = findDataProp(props, "data-testid");
  const visible = useIsOverflowItemVisible(id);
  const active = isItemActive?.(item);

  const renderProps = useMemo(() => ({ item, active }), [item, active]);

  const handleClick = useCallback(
    () => onItemClick?.(item),
    [item, onItemClick],
  );

  if (visible) {
    return null;
  }

  return (
    <MenuItem active={active} onClick={handleClick} data-testid={testId}>
      <Comp {...renderProps} />
    </MenuItem>
  );
};

const ListMenu = (props: OverflowListProps<any>) => {
  const {
    ref,
    overflowCount: count,
    isOverflowing,
  } = useOverflowMenu<HTMLDivElement>();

  const {
    items,
    renderMenuTrigger: TriggerComp,
    onItemClick,
    menuProps,
  } = props;
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  const triggerRef = useRefs(ref, setTarget);

  const showMenu = useCallback(() => setShow(true), []);
  const hideMenu = useCallback(() => setShow(false), []);

  const handleItemClick = useCallback(
    (item: OverflowListItem) => {
      hideMenu();
      onItemClick?.(item);
    },
    [hideMenu, onItemClick],
  );

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showMenu();
      } else if (e.key === "Escape" && show) {
        e.preventDefault();
        hideMenu();
      }
    },
    [show, showMenu, hideMenu],
  );

  const menuId = useId();

  if (!isOverflowing) {
    return null;
  }

  const testId = findDataProp(props, "data-testid");

  return (
    <>
      <div
        onClick={showMenu}
        onKeyDown={handleTriggerKeyDown}
        className={styles.button}
        ref={triggerRef as any}
        data-testid={makeTestId(testId, testId, "trigger")}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={show}
        aria-controls={show ? menuId : undefined}
        aria-label={`Show ${count} more items`}
      >
        <TriggerComp count={count} open={show} />
      </div>
      <Menu
        {...menuProps}
        id={menuId}
        target={target}
        show={show}
        onHide={hideMenu}
        navigation
        data-testid={testId}
        aria-label="Overflow menu"
      >
        {items.map((item) => (
          <ListMenuItem
            key={item.id}
            {...props}
            item={item}
            onItemClick={handleItemClick}
            data-testid={makeTestId(testId, "item", item.id)}
          />
        ))}
      </Menu>
    </>
  );
};
