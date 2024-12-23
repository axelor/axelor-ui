import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

export type NavTreeArrowProps = {
  expanded?: boolean;
  expanding?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

export type NavTreeCheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  tabIndex: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export type NavTreeState = {
  active?: NavTreeItem | null;
  selected?: NavTreeItem[];
  expanded?: NavTreeItem[];
};

export type NavTreeSharedProps = NavTreeState & {
  checkbox?: boolean;
  menu?: boolean;
  filter?: (item: NavTreeItem) => boolean;
  onActiveChange?: (item: NavTreeItem | null) => void;
  onSelectedChange?: (items: NavTreeItem[]) => void;
  onExpandedChange?: (items: NavTreeItem[]) => void;
  onItemClick?: (
    e: React.MouseEvent<HTMLDivElement>,
    item: NavTreeItem,
  ) => void;
  onItemKeyDown?: (
    e: React.KeyboardEvent<HTMLDivElement>,
    item: NavTreeItem,
  ) => void;
  onItemKeyUp?: (
    e: React.KeyboardEvent<HTMLDivElement>,
    item: NavTreeItem,
  ) => void;
  onItemFocus?: (
    e: React.FocusEvent<HTMLDivElement>,
    item: NavTreeItem,
  ) => void;
  onItemBlur?: (e: React.FocusEvent<HTMLDivElement>, item: NavTreeItem) => void;
  onItemToggle?: (item: NavTreeItem, isExpanded: boolean) => void;
  renderTitle?: (props: NavTreeTitleProps) => React.ReactNode;
  renderArrow?: (props: NavTreeArrowProps) => React.ReactNode;
  renderCheckbox?: (props: NavTreeCheckboxProps) => React.ReactNode;
};

export type NavTreeProps = NavTreeSharedProps & {
  items: NavTreeItem[];
  filterText?: string;
  [`aria-label`]?: string;
};

function useTreeState(props: NavTreeState) {
  const [active = null, setActive] = useControlled({
    name: "NavTree",
    prop: "active",
    state: props.active,
  });

  const [selected = EMPTY, setSelected] = useControlled({
    name: "NavTree",
    prop: "selected",
    state: props.selected,
  });

  const [expanded = EMPTY, setExpanded] = useControlled({
    name: "NavTree",
    prop: "expanded",
    state: props.expanded,
  });

  return {
    active,
    setActive,
    selected,
    setSelected,
    expanded,
    setExpanded,
  };
}

function filterTree(
  items: NavTreeItem[],
  filter: (item: NavTreeItem) => boolean,
): NavTreeItem[] {
  return items
    .map((item) => {
      const newItem = { ...item };
      if (newItem.items) {
        newItem.items = filterTree(newItem.items, filter);
      }
      return newItem;
    })
    .filter((item) => filter(item) || (item.items && item.items.length > 0));
}

function findParents(items: NavTreeItem[]) {
  const parents: NavTreeItem[] = [];
  items.forEach((item) => {
    if (item.items) {
      parents.push(item);
      parents.push(...findParents(item.items));
    }
  });
  return parents;
}

function useTree(props: NavTreeProps) {
  const { items, filterText, filter } = props;

  const mainState = useTreeState(props);
  const tempState = useTreeState({});

  const filtered = useMemo(
    () => (filter ? filterTree(items, filter) : items),
    [items, filter],
  );

  const textRef = useRef(filterText);

  useEffect(() => {
    textRef.current = filterText;
  }, [filterText]);

  const isMain = !filterText;
  const isTemp = textRef.current === filterText;

  const active = useMemo(() => {
    const last = textRef.current;
    if (filtered === items) return mainState.active;
    if (last === filterText) return tempState.active;
  }, [filterText, filtered, items, mainState.active, tempState.active]);

  const selected = useMemo(() => {
    if (isMain) return mainState.selected;
    if (isTemp) return tempState.selected;
    return [];
  }, [isMain, isTemp, mainState.selected, tempState.selected]);

  const expanded = useMemo(() => {
    if (isMain) return mainState.expanded;
    if (isTemp) return tempState.expanded;
    return findParents(filtered).filter((x) => x.items!.length > 0);
  }, [filtered, isMain, isTemp, mainState.expanded, tempState.expanded]);

  const setActive = isMain ? mainState.setActive : tempState.setActive;
  const setSelected = isMain ? mainState.setSelected : tempState.setSelected;
  const setExpanded = isMain ? mainState.setExpanded : tempState.setExpanded;

  return {
    items: isMain ? items : filtered,
    active,
    setActive,
    selected,
    setSelected,
    expanded,
    setExpanded,
  };
}

function NavTreeC(
  props: NavTreeProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { onActiveChange, onSelectedChange, onExpandedChange } = props;

  const {
    items,
    active,
    selected,
    expanded,
    setActive,
    setSelected,
    setExpanded,
  } = useTree(props);

  const ariaLabel = props["aria-label"];

  const handleActiveChange = useCallback(
    (item: NavTreeItem | null) => {
      setActive(item);
      onActiveChange?.(item);
    },
    [onActiveChange, setActive],
  );

  const handleSelectedChange = useCallback(
    (newSelected: NavTreeItem[]) => {
      setSelected(newSelected);
      onSelectedChange?.(newSelected);
    },
    [onSelectedChange, setSelected],
  );

  const handleExpandedChange = useCallback(
    (newExpanded: NavTreeItem[]) => {
      setExpanded(newExpanded);
      onExpandedChange?.(newExpanded);
    },
    [onExpandedChange, setExpanded],
  );

  return (
    <div className={styles.tree} ref={ref} role="tree" aria-label={ariaLabel}>
      <NavTreeNodes
        {...props}
        level={0}
        items={items}
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

function NavTreeNodes(props: NavTreeNodesProps) {
  const { items, ...rest } = props;
  const { level } = props;
  return (
    <div className={styles.nodes}>
      {items.map((item, index) => (
        <NavTreeNode
          {...rest}
          key={item.id}
          item={item}
          focusable={level === 0 && index === 0}
        />
      ))}
    </div>
  );
}

type NavTreeNodeProps = NavTreeSharedProps & {
  item: NavTreeItem;
  level: number;
  focusable: boolean;
};

const EMPTY: NavTreeItem[] = [];

function NavTreeNode(props: NavTreeNodeProps) {
  const {
    menu,
    item,
    level,
    active,
    selected = EMPTY,
    expanded = EMPTY,
    checkbox,
    focusable,
    onActiveChange,
    onSelectedChange,
    onExpandedChange,
    onItemClick,
    onItemKeyDown,
    onItemKeyUp,
    onItemFocus,
    onItemBlur,
    onItemToggle,
    renderTitle: Title = NavTreeTitle,
    renderArrow: Arrow = NavTreeArrow,
    renderCheckbox: Checkbox = NavTreeCheckbox,
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

  const descendants = useMemo(() => getAllDescendants(item), [item]);

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
    const res = onItemToggle?.(item, !isExpanded) as unknown;
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

  const handleArrowClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      toggle();
    },
    [toggle],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onItemKeyDown?.(e, item);
      if (e.defaultPrevented) {
        return;
      }

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
    [hasChildren, isExpanded, item, onItemKeyDown, toggle],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onItemKeyUp?.(e, item);
    },
    [item, onItemKeyUp],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onItemFocus?.(e, item);
    },
    [item, onItemFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      onItemBlur?.(e, item);
    },
    [item, onItemBlur],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // if not checkbox, select the item
      if (!checkbox) {
        onSelectedChange?.([item]);
      }
      // if menu, toggle the item
      if (menu) {
        toggle();
      }
      onActiveChange?.(item);
      onItemClick?.(e, item);
    },
    [
      checkbox,
      item,
      menu,
      onActiveChange,
      onItemClick,
      onSelectedChange,
      toggle,
    ],
  );

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

  const style = useMemo(
    () =>
      ({
        "--nav-tree-item-indent": level,
      }) as React.CSSProperties,
    [level],
  );

  const renderArrow = () => (
    <div className={styles.icon}>
      {hasChildren && (
        <Arrow
          expanded={isExpanded}
          expanding={isExpanding}
          onClick={handleArrowClick}
        />
      )}
    </div>
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
        tabIndex={focusable ? 0 : -1}
        className={styles.content}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        role="treeitem"
        aria-level={level + 1}
        aria-expanded={hasChildren ? isExpanded : undefined}
        data-item-id={item.id}
      >
        {menu || renderArrow()}
        {checkbox && (
          <div className={styles.checkbox}>
            <Checkbox
              tabIndex={-1}
              indeterminate={!!isIndeterminate}
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>
        )}
        <div className={styles.title}>
          <Title
            item={item}
            level={level}
            active={isActive}
            selected={isSelected}
            expanded={isExpanded}
          />
        </div>
        {menu && renderArrow()}
      </div>
      {hasChildren && (
        <Collapse in={isExpanded} mountOnEnter unmountOnExit>
          <NavTreeNodes {...props} items={item.items!} level={level + 1} />
        </Collapse>
      )}
    </div>
  );
}

export const NavTree = forwardRef<HTMLDivElement, NavTreeProps>(NavTreeC);

function NavTreeTitle(props: NavTreeTitleProps) {
  const { item } = props;
  const { title } = item;
  return <div>{title}</div>;
}

function NavTreeCheckbox(props: NavTreeCheckboxProps) {
  const { tabIndex, checked, indeterminate, onChange } = props;

  const checkboxRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (input) {
        input.indeterminate = !!indeterminate;
      }
    },
    [indeterminate],
  );

  return (
    <Input
      tabIndex={tabIndex}
      type="checkbox"
      checked={checked}
      ref={checkboxRef}
      onChange={onChange}
    />
  );
}

export function NavTreeArrow(props: NavTreeArrowProps) {
  const { expanded, expanding, onClick } = props;
  return (
    <div
      className={clsx(styles.toggle, {
        [styles.expanded]: expanded,
      })}
      onClick={onClick}
    >
      {expanding && (
        <MaterialIcon className={styles.wait} icon="progress_activity" />
      )}
      {expanding || (
        <MaterialIcon className={styles.arrow} icon="chevron_right" />
      )}
    </div>
  );
}
