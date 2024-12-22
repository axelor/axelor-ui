import { useCallback, useMemo, useState } from "react";

import { MaterialIcon } from "../../icons/material-icon";
import { clsx } from "../clsx";
import { Collapse } from "../collapse";
import { useControlled } from "../hooks";
import { Input } from "../input";

import styles from "./nav-tree.module.scss";

export type NavTreeItem = {
  id: string;
  title: string;
  data?: unknown;
  items?: NavTreeItem[];
};

export type NavTreeTitleProps = {
  item: NavTreeItem;
  level: number;
  active: boolean;
  selected: boolean;
  expanded: boolean;
};

export type NavTreeSharedProps = {
  active?: NavTreeItem | null;
  selected?: NavTreeItem[];
  expanded?: NavTreeItem[];
  checkbox?: boolean;
  isVisible?: (item: NavTreeItem, descendants: NavTreeItem[]) => boolean;
  onActiveChange?: (item: NavTreeItem | null) => void;
  onSelectedChange?: (items: NavTreeItem[]) => void;
  onExpandedChange?: (items: NavTreeItem[]) => void;
  onItemClick?: (item: NavTreeItem) => void;
  onItemToggle?: (
    item: NavTreeItem,
    isExpanded: boolean,
  ) => void | Promise<void>;
  renderTitle?: (props: NavTreeTitleProps) => React.ReactNode;
};

export type NavTreeProps = NavTreeSharedProps & {
  items: NavTreeItem[];
};

export function NavTree(props: NavTreeProps) {
  const { onActiveChange, onSelectedChange, onExpandedChange } = props;

  const [active, setActive] = useControlled({
    name: "NavTree",
    prop: "active",
    state: props.active,
  });

  const [selected, setSelected] = useControlled({
    name: "NavTree",
    prop: "selected",
    state: props.selected,
  });

  const [expanded, setExpanded] = useControlled({
    name: "NavTree",
    prop: "expanded",
    state: props.expanded,
  });

  const handleActiveChange = useCallback(
    (item: NavTreeItem | null) => {
      setActive(item);
      onActiveChange?.(item);
    },
    [onActiveChange, setActive],
  );

  const handleSelectedChange = useCallback(
    (items: NavTreeItem[]) => {
      setSelected(items);
      onSelectedChange?.(items);
    },
    [onSelectedChange, setSelected],
  );

  const handleExpandedChange = useCallback(
    (items: NavTreeItem[]) => {
      setExpanded(items);
      onExpandedChange?.(items);
    },
    [onExpandedChange, setExpanded],
  );

  return (
    <div className={styles.tree}>
      <NavTreeNodes
        {...props}
        level={0}
        active={active}
        selected={selected}
        expanded={expanded}
        onActiveChange={handleActiveChange}
        onSelectedChange={handleSelectedChange}
        onExpandedChange={handleExpandedChange}
      />
    </div>
  );
}

type NavTreeNodesProps = NavTreeProps & {
  level: number;
};

function getAllDescendants(item: NavTreeItem): NavTreeItem[] {
  const descendants: NavTreeItem[] = [item];
  item.items?.forEach((child) => {
    descendants.push(...getAllDescendants(child));
  });
  return descendants;
}

const defaultVisible = () => true;

function NavTreeNodes(props: NavTreeNodesProps) {
  const { items, ...rest } = props;
  const { isVisible = defaultVisible } = props;

  const nodes = useMemo(
    () =>
      items
        .map((item) => [item, getAllDescendants(item)] as const)
        .filter(([item, descendants]) => isVisible(item, descendants)),
    [isVisible, items],
  );

  return (
    <div className={styles.nodes}>
      {nodes.map(([item, descendants]) => (
        <NavTreeNode
          {...rest}
          key={item.id}
          item={item}
          descendants={descendants}
        />
      ))}
    </div>
  );
}

type NavTreeNodeProps = NavTreeSharedProps & {
  item: NavTreeItem;
  descendants: NavTreeItem[];
  level: number;
};

const EMPTY: NavTreeItem[] = [];

function NavTreeNode(props: NavTreeNodeProps) {
  const {
    item,
    level,
    active,
    selected = EMPTY,
    expanded = EMPTY,
    checkbox,
    descendants,
    onActiveChange,
    onSelectedChange,
    onExpandedChange,
    onItemClick,
    onItemToggle,
    renderTitle: Title = NavTreeTitle,
  } = props;

  const hasChildren = useMemo(() => !!item.items, [item.items]);

  const isActive = useMemo(() => active?.id === item.id, [active?.id, item.id]);
  const isExpanded = useMemo(
    () => expanded?.some((i) => i.id === item.id),
    [expanded, item.id],
  );
  const isSelected = useMemo(
    () => selected?.some((i) => i.id === item.id),
    [item.id, selected],
  );

  const selectedDescendants = useMemo(
    () => descendants.filter((desc) => selected.some((s) => s.id === desc.id)),
    [descendants, selected],
  );

  const isIndeterminate = useMemo(
    () =>
      hasChildren &&
      selectedDescendants.length > 0 &&
      selectedDescendants.length < descendants.length,
    [descendants.length, hasChildren, selectedDescendants.length],
  );

  const isChecked = useMemo(
    () => selectedDescendants.length === descendants.length,
    [descendants.length, selectedDescendants.length],
  );

  const [isExpanding, setExpanding] = useState(false);

  const toggle = useCallback(() => {
    const items = expanded ?? [];
    const newExpanded = isExpanded
      ? items.filter((x) => x.id !== item.id)
      : [...items, item];
    setExpanding(true);
    const res = onItemToggle?.(item, !isExpanded);
    if (res instanceof Promise) {
      res.finally(() => {
        onExpandedChange?.(newExpanded);
        setExpanding(false);
      });
    } else {
      onExpandedChange?.(newExpanded);
      setExpanding(false);
    }
  }, [expanded, isExpanded, item, onExpandedChange, onItemToggle]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      // toggle on arrow keys
      if (hasChildren) {
        if (e.key === "ArrowRight" && !isExpanded) toggle();
        if (e.key === "ArrowLeft" && isExpanded) toggle();
      }

      // move focus
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const tree = e.currentTarget.closest(`.${styles.tree}`);
        const items = tree?.querySelectorAll(`.${styles.content}`);
        const elems = [...(items ?? [])];
        const index = elems.indexOf(e.currentTarget);
        const inc = e.key === "ArrowDown" ? 1 : -1;
        const next = elems[index + inc] as HTMLElement;
        next?.focus();
      }

      // on enter key, make the item active
      if (e.key === "Enter") {
        e.currentTarget.click();
        if (hasChildren) toggle();
      }

      // on space key, select the item
      if (e.key === " ") {
        e.preventDefault();
        e.currentTarget.click();
        e.currentTarget.querySelector("input")?.click();
      }
    },
    [hasChildren, isExpanded, toggle],
  );

  const handleClick = useCallback(() => {
    // if not checkbox, select the item
    if (!checkbox) {
      onSelectedChange?.([item]);
    }
    onActiveChange?.(item);
    onItemClick?.(item);
  }, [checkbox, item, onActiveChange, onItemClick, onSelectedChange]);

  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();

      let newSelected: NavTreeItem[];

      if (e.target.checked) {
        // Add this item and all descendants
        newSelected = [
          ...selected,
          ...descendants.filter(
            (desc) => !selected.some((s) => s.id === desc.id),
          ),
        ];
      } else {
        // Remove this item and all descendants
        newSelected = selected.filter(
          (s) => !descendants.some((desc) => desc.id === s.id),
        );
      }

      onSelectedChange?.(newSelected);
    },
    [descendants, onSelectedChange, selected],
  );

  const checkboxRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (input) {
        input.indeterminate = !!isIndeterminate;
      }
    },
    [isIndeterminate],
  );

  const style = useMemo(
    () =>
      ({
        "--nav-tree-item-indent": level,
      }) as React.CSSProperties,
    [level],
  );

  return (
    <div
      className={clsx(styles.node, {
        [styles.active]: isActive,
        [styles.selected]: isSelected,
      })}
      style={style}
    >
      <div
        tabIndex={0}
        className={styles.content}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        <div className={styles.icon}>
          {hasChildren && (
            <div
              className={clsx(styles.toggle, {
                [styles.expanded]: isExpanded,
              })}
              onClick={toggle}
            >
              {isExpanding && (
                <MaterialIcon
                  className={styles.wait}
                  icon="progress_activity"
                />
              )}
              {isExpanding || (
                <MaterialIcon className={styles.arrow} icon="chevron_right" />
              )}
            </div>
          )}
        </div>
        {checkbox && (
          <div className={styles.checkbox}>
            <Input
              tabIndex={-1}
              type="checkbox"
              checked={isChecked}
              ref={checkboxRef}
              onChange={handleCheckboxChange}
            />
          </div>
        )}
        <Title
          item={item}
          level={level}
          active={isActive}
          selected={isSelected}
          expanded={isExpanded}
        />
      </div>
      {hasChildren && (
        <Collapse in={isExpanded} mountOnEnter unmountOnExit>
          <NavTreeNodes {...props} items={item.items!} level={level + 1} />
        </Collapse>
      )}
    </div>
  );
}

function NavTreeTitle(props: NavTreeTitleProps) {
  const { item } = props;
  const { title } = item;
  return <div className={styles.title}>{title}</div>;
}
