import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MaterialIcon } from "../../icons/material-icon";
import { ClickAwayListener } from "../click-away-listener";
import { clsx } from "../clsx";
import { Collapse } from "../collapse";
import { Fade } from "../fade";
import { Scrollable } from "../scrollable";
import { findDataProp, makeTestId } from "../system/utils";
import { TextField } from "../text-field";
import { getRGB } from "./utils";

import { Box } from "../box";
import { Popper, usePopperTrigger } from "../popper";
import styles from "./nav-menu.module.scss";

export interface NavMenuItem {
  /**
   * The item id should be unique among all the menu items.
   *
   */
  id: string;

  /**
   * The display title.
   *
   */
  title: string;

  /**
   * The help text to describe the menu item.
   *
   */
  help?: string;

  /**
   * The icon to show.
   */
  icon?: (props: { color?: string }) => JSX.Element | null;

  /**
   * The color for the icon.
   *
   */
  iconColor?: string;

  /**
   * The tag to show.
   *
   */
  tag?: (props: { color?: string }) => JSX.Element | null;

  /**
   * The color for the tag.
   *
   */
  tagColor?: string;

  /**
   * The sub menu items.
   *
   */
  items?: NavMenuItem[];

  /**
   * The click handler.
   *
   */
  onClick?: () => void;
}

export interface NavMenuProps {
  /**
   * The display mode.
   *
   * - `accordion` - show menus as accordion
   * - `icons` - show icons only
   *
   * The display of the menu further depends on the `show` property.
   *
   */
  mode: "accordion" | "icons";

  /**
   * The visibility mode.
   *
   * - `inline` - show the menu inline
   * - `overlay` - show the menu as overlay
   * - `icons` - show only the icons
   * - `none` - show nothing
   *
   * Depending on the `mode`, the menu will be displayed differently.
   *
   */
  show: "inline" | "overlay" | "icons" | "none";

  /**
   * List of menus.
   *
   */
  items: NavMenuItem[];

  /**
   * The click event handler.
   *
   */
  onItemClick?: (item: NavMenuItem) => void;

  /**
   * Menu search options.
   */
  searchOptions?: {
    /**
     * The search title text.
     */
    title?: string;

    /**
     * Used to filter search menu items
     */
    filter?: (item: NavMenuItem, term: string) => boolean;
    /**
     * Called when search menu shows.
     */
    onShow?: () => void;

    /**
     * Called when search menu hides.
     */
    onHide?: () => void;
  };

  /**
   * Show the search menu.
   */
  searchActive?: boolean;

  /**
   * The header element.
   *
   */
  header?: React.ReactNode;

  /**
   * The smaller header to show in icons bar.
   *
   */
  headerSmall?: React.ReactNode;

  style?: React.CSSProperties;

  className?: string;
}

export function NavMenu(props: NavMenuProps) {
  const {
    mode,
    show,
    items,
    header,
    headerSmall,
    style,
    className,
    searchOptions,
    searchActive,
    onItemClick,
  } = props;
  const menus = useMemo(() => items.map((item) => walk(item)), [items]);
  const showIcons = mode === "icons";
  const Comp = showIcons ? Icons : Accordion;
  const testId = findDataProp(props, "data-testid");
  return (
    <div
      className={clsx(
        className,
        styles.nav,
        styles[`mode-${mode}`],
        styles[`show-${show}`],
      )}
      style={style}
      data-testid={testId}
    >
      <Comp
        mode={mode}
        show={show}
        items={menus}
        header={header}
        headerSmall={headerSmall}
        searchOptions={searchOptions}
        searchActive={searchActive}
        onItemClick={onItemClick}
        data-testid={testId}
      />
    </div>
  );
}

function walk(item: NavMenuNode, parent?: NavMenuNode): NavMenuNode {
  const parentId = parent?.id;
  const rootId = parent?.rootId ?? parent?.parentId ?? parent?.id;
  const result = { ...item, parentId, rootId };
  if (item.items) {
    return { ...result, items: item.items.map((item) => walk(item, result)) };
  }
  return result;
}

interface NavMenuNode extends NavMenuItem {
  rootId?: string;
  parentId?: string;
}

interface ItemProps {
  item: NavMenuItem;
  state: {
    active?: string | null;
    lookup?: string | null;
    selected?: Record<string, string>;
  };
  onItemClick?: (item: NavMenuItem) => void;
  onItemHover?: (item: NavMenuItem) => void;
  isSubItems?: boolean;
}

interface VariantProps extends NavMenuProps {
  onItemHover?: (item: NavMenuItem) => void;
}

function useNavMenu({
  mode,
  show,
  items,
  searchOptions,
  searchActive,
  onItemClick,
}: VariantProps) {
  const [showSearch, setSearchShow] = useState(searchActive ?? false);
  const [active, setActive] = useState<string | null>(null);
  const [lookup, setLookup] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const showIcons = show === "icons";

  const searchEnabled = Boolean(searchOptions);
  const searchItem = useMemo(
    () => ({
      id: "-1009",
      title: searchOptions?.title ?? "Search menu...",
      icon: () => <MaterialIcon icon="search" />,
      items,
    }),
    [items, searchOptions?.title],
  );

  const icons = useMemo(
    () => (searchEnabled ? [searchItem, ...items] : items),
    [items, searchEnabled, searchItem],
  );

  const setShowSearch = useCallback(
    (active: boolean) => {
      const { onShow, onHide } = searchOptions ?? {};
      if (active !== showSearch) {
        active ? onShow?.() : onHide?.();
        setSearchShow(active && searchEnabled);
        setLookup(active ? searchItem.id : null);
      }
    },
    [searchEnabled, searchItem.id, searchOptions, showSearch],
  );

  useEffect(() => {
    if (searchActive !== undefined) {
      setShowSearch(searchActive && searchEnabled);
    }
  }, [searchActive, searchEnabled, setShowSearch]);

  const handleEnter = useCallback(() => {
    const id = active || (items[0] || {}).id;
    setLookup(id);
  }, [active, items]);

  const handleLeave = useCallback(() => {
    setLookup(null);
  }, []);

  const handleItemClick = useCallback(
    (item: NavMenuNode) => {
      const root = item.rootId || item.id;
      const items = item.items || [];

      if (item === searchItem) {
        return;
      }

      if (mode === "accordion") {
        setActive(root);
        setSelected(() => ({ [root]: item.id }));
      }
      if (mode === "icons") {
        setSelected((prev) => ({ ...prev, [root]: item.id }));
      }
      if (items.length === 0) {
        setActive(root);
      }

      onItemClick?.(item);
      setShowSearch(false);

      if (items.length === 0) {
        setLookup(null);
      }
    },
    [mode, onItemClick, searchItem, setShowSearch],
  );

  const handleIconClick = useCallback(
    (item: NavMenuNode) => {
      const root = item.rootId ?? item.id;
      if (item === searchItem) {
        return;
      }
      onItemClick?.(item);
      setShowSearch(false);
      setActive(root);
      setLookup(null);
    },
    [onItemClick, searchItem, setShowSearch],
  );

  const handleIconHover = useCallback(
    (item: NavMenuNode) => {
      setLookup(item.id);
      if (searchEnabled && item.id === searchItem.id) {
        setShowSearch(true);
      } else {
        setShowSearch(false);
      }
    },
    [searchEnabled, searchItem.id, setShowSearch],
  );

  const handleSearchClick = useCallback(() => {
    setShowSearch(true);
  }, [setShowSearch]);

  const state = useMemo(
    () => ({ active, lookup, selected }),
    [active, lookup, selected],
  );

  return {
    mode,
    show,
    icons,
    items,
    state,
    showIcons,
    showSearch,
    searchItem,
    searchEnabled,
    handleEnter,
    handleLeave,
    handleItemClick,
    handleIconClick,
    handleIconHover,
    handleSearchClick,
  };
}

function Accordion(props: VariantProps) {
  const {
    state,
    icons,
    items,
    showIcons,
    showSearch,
    searchItem,
    searchEnabled,
    handleEnter,
    handleLeave,
    handleItemClick,
    handleSearchClick,
  } = useNavMenu(props);

  const { lookup } = state;
  const { header, headerSmall, searchOptions } = props;
  const testId = findDataProp(props, "data-testid");

  return (
    <ClickAwayListener onClickAway={handleLeave}>
      <div
        className={clsx(styles.accordion, {
          [styles.hover]: lookup || (showIcons && showSearch),
        })}
        onMouseMove={handleEnter}
        onMouseLeave={handleLeave}
      >
        {showIcons && (
          <MenuIcons
            mode="icons"
            show="icons"
            state={state}
            items={icons}
            header={headerSmall}
            data-testid={makeTestId(testId, "icons-bar")}
          />
        )}
        {showSearch && (
          <div
            className={clsx(styles.menus, styles.search)}
            data-testid={makeTestId(testId, "search-panel")}
          >
            {header && <div className={styles.menusHeader}>{header}</div>}
            <SearchMenu
              item={searchItem}
              state={state}
              filter={searchOptions?.filter}
              onItemClick={handleItemClick}
              data-testid={makeTestId(testId, "search-menu")}
            />
          </div>
        )}
        <div className={styles.menus} data-testid={makeTestId(testId, "menus")}>
          {header && <div className={styles.menusHeader}>{header}</div>}
          <Scrollable className={styles.menusInner}>
            {searchEnabled && (
              <div
                className={clsx(styles.item, styles.searchItem)}
                onClick={handleSearchClick}
                data-testid={makeTestId(testId, "search-trigger")}
              >
                <div className={styles.title}>
                  <MenuIcon
                    item={searchItem}
                    state={{}}
                    data-testid={makeTestId(testId, "search-icon")}
                  />
                  <div className={styles.text}>{searchItem.title}</div>
                </div>
              </div>
            )}
            {items.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                state={state}
                onItemClick={handleItemClick}
                data-testid={makeTestId(testId, "item", item.id)}
              />
            ))}
          </Scrollable>
        </div>
      </div>
    </ClickAwayListener>
  );
}

function Icons(props: VariantProps) {
  const {
    state,
    icons,
    items,
    showSearch,
    searchItem,
    handleLeave,
    handleItemClick,
    handleIconClick,
    handleIconHover,
  } = useNavMenu(props);

  const { headerSmall, searchOptions } = props;
  const hover = showSearch ? searchItem.id : state.lookup;
  const testId = findDataProp(props, "data-testid");

  return (
    <div
      className={clsx(styles.buttons, {
        [styles.hover]: hover,
      })}
      onMouseLeave={handleLeave}
    >
      <MenuIcons
        mode="icons"
        show="icons"
        state={state}
        items={icons}
        header={headerSmall}
        onItemClick={handleIconClick}
        onItemHover={handleIconHover}
        data-testid={makeTestId(testId, "icons-bar")}
      />
      <div className={styles.menusWrapper}>
        <div className={styles.menus}>
          {showSearch && (
            <SearchMenu
              item={searchItem}
              state={state}
              filter={searchOptions?.filter}
              onItemClick={handleItemClick}
              data-testid={makeTestId(testId, "search-menu")}
            />
          )}
          {items.map((item) => (
            <Menu
              key={item.id}
              item={item}
              state={state}
              onItemClick={handleItemClick}
              data-testid={makeTestId(testId, "menu", item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Menu(props: ItemProps) {
  const { item, state, onItemClick } = props;
  const { id, title } = item;
  const testId = findDataProp(props, "data-testid");

  const active = state.lookup ? false : state.active === id;
  const hover = state.lookup === id;

  return (
    <div
      className={clsx(styles.menu, {
        [styles.active]: active,
        [styles.hover]: hover,
      })}
      data-testid={testId}
    >
      <div className={styles.header} data-testid={makeTestId(testId, "header")}>
        <MenuIcon item={item} state={{}} />
        <div className={styles.text}>{title}</div>
      </div>
      <Scrollable>
        <MenuItems
          item={item}
          state={state}
          onItemClick={onItemClick}
          data-testid={makeTestId(testId, "items")}
        />
      </Scrollable>
    </div>
  );
}

function UnknownIcon() {
  return <MaterialIcon icon="apps" />;
}

function MenuIcon(props: ItemProps) {
  const { item, state, onItemClick, onItemHover } = props;
  const { icon, iconColor } = item;
  const Icon = icon || UnknownIcon;
  const testId = findDataProp(props, "data-testid");

  const bg = useMemo(() => iconColor && getRGB(iconColor, 0.1), [iconColor]);
  const hoverBg = useMemo(
    () => iconColor && getRGB(iconColor, 0.2),
    [iconColor],
  );
  const activeBg = useMemo(
    () => iconColor && getRGB(iconColor, 0.3),
    [iconColor],
  );

  const hover = item.id === state.lookup;

  const handleClick = useCallback(() => {
    onItemClick?.(item);
  }, [item, onItemClick]);

  const handleHover = useCallback(() => {
    onItemHover?.(item);
  }, [item, onItemHover]);

  return (
    <div
      className={clsx(styles.icon, {
        [styles.hover]: hover,
      })}
      style={
        {
          "--ax-nav-menu-icon-bg": bg,
          "--ax-nav-menu-icon-hover-bg": hoverBg,
          "--ax-nav-menu-icon-hover-color": iconColor,
          "--ax-nav-menu-icon-active-bg": activeBg,
          "--ax-nav-menu-icon-active-color": iconColor,
          "--ax-nav-menu-icon-color": iconColor,
        } as any
      }
      onClick={handleClick}
      onMouseOver={handleHover}
      data-testid={testId}
    >
      <Icon color={iconColor} />
    </div>
  );
}

function MenuIcons(props: VariantProps & { state: ItemProps["state"] }) {
  const { items, state, header, onItemClick, onItemHover } = props;
  const testId = findDataProp(props, "data-testid");

  return (
    <Scrollable className={styles.menusIcon} data-testid={testId}>
      <div className={styles.icons}>
        {header && <div className={styles.iconsHeader}>{header}</div>}
        {items.map((item) => (
          <MenuIcon
            key={item.id}
            item={item}
            state={state}
            onItemClick={onItemClick}
            onItemHover={onItemHover}
            data-testid={makeTestId(testId, "icon", item.id)}
          />
        ))}
      </div>
    </Scrollable>
  );
}

function MenuItem(props: ItemProps) {
  const { item, state, onItemClick } = props;
  const node: NavMenuNode = item;
  const { icon, tag: Tag, tagColor, title, help, items = [], onClick } = item;
  const testId = findDataProp(props, "data-testid");

  const {
    open: popperOpen,
    targetEl,
    setTargetEl,
  } = usePopperTrigger({ trigger: "hover", delay: { open: 500, close: 100 } });

  const root = node.rootId || item.id;
  const active = item.id === state.active;
  const selected = state.selected?.[root] === item.id;

  const [open, setOpen] = useState(false);

  const hasIcon = Boolean(icon);
  const hasItems = items.length > 0;

  const handleClick = useCallback(() => {
    if (hasItems) {
      setOpen((prev) => !prev);
    }
    onItemClick?.(item);
    onClick?.();
  }, [hasItems, item, onClick, onItemClick]);

  useEffect(() => {
    if (active) return;
    setOpen(false);
  }, [active]);

  return (
    <div
      className={clsx(styles.item, {
        [styles.open]: open,
        [styles.selected]: selected,
      })}
      data-testid={testId}
    >
      <div
        className={styles.title}
        onClick={handleClick}
        ref={setTargetEl}
        data-testid={makeTestId(testId, "title")}
      >
        {hasIcon && <MenuIcon item={item} state={state} />}
        {hasIcon || <div className={styles.icon}></div>}
        <div className={styles.text}>{title}</div>
        {Tag && (
          <div className={styles.tag}>
            <Tag color={tagColor} />
          </div>
        )}
        <div className={styles.expand}>
          {hasItems && <MaterialIcon icon="keyboard_arrow_down" />}
        </div>
      </div>
      {help && (
        <Popper
          open={popperOpen}
          target={targetEl}
          offset={[7, 0]}
          className={styles.helpPopover}
          arrow
          shadow
          rounded
          placement="end"
          data-testid={makeTestId(testId, "help")}
        >
          <Box p={2} style={{ maxWidth: 320 }}>
            <span dangerouslySetInnerHTML={{ __html: help }} />
          </Box>
        </Popper>
      )}
      {hasItems && (
        <Collapse in={open} mountOnEnter unmountOnExit>
          <MenuItems
            item={item}
            state={state}
            onItemClick={onItemClick}
            isSubItems
            data-testid={makeTestId(testId, "sub-items")}
          />
        </Collapse>
      )}
    </div>
  );
}

function MenuItems(props: ItemProps) {
  const { item, state, onItemClick, isSubItems } = props;
  const { items = [] } = item;
  const testId = findDataProp(props, "data-testid");

  return (
    <div
      className={clsx(styles.items, { [styles.subItems]: isSubItems })}
      data-testid={isSubItems ? undefined : testId}
    >
      {items.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          state={state}
          onItemClick={onItemClick}
          data-testid={makeTestId(testId, "item", item.id)}
        />
      ))}
    </div>
  );
}

function flattenItem(item: NavMenuItem, parent?: NavMenuItem) {
  let { items = [], icon, tag, ...rest } = item;
  let title = parent ? `${parent.title} / ${item.title}` : item.title;

  rest = { ...rest, title };
  items = items.flatMap((child) => flattenItem(child, rest)).flat();

  // don't include parent
  return items.length ? items : [rest];
}

function SearchMenu(
  props: ItemProps & {
    filter?: (item: NavMenuItem, searchText: string) => boolean;
  },
) {
  const { item, state, filter: filterMenuItem, onItemClick } = props;
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(0);
  const itemsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const testId = findDataProp(props, "data-testid");

  const hover = true;

  const items = useMemo(
    () => item.items?.flatMap((x) => flattenItem(x)).flat(),
    [item],
  );

  const filtered = useMemo(() => {
    if (show && items) {
      return items.filter((item) =>
        filterMenuItem
          ? filterMenuItem(item, text)
          : item.title.toLowerCase().includes(text.toLowerCase()),
      );
    }
    return [];
  }, [items, filterMenuItem, show, text]);

  const canShow = hover ?? false;

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    setShow(!!value);
  }, []);

  const cancelSearch = useCallback(
    () => onItemClick?.({ id: state.active || "", title: "" }),
    [onItemClick, state.active],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        cancelSearch();
        return;
      }
      if (e.key === "Enter") {
        if (cursor > -1) {
          const item = filtered[cursor];
          item && onItemClick?.(item);
        }
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const inc = e.key === "ArrowUp" ? -1 : 1;
        const min = 0;
        const max = filtered.length - 1;
        const index = cursor + inc;

        const next =
          e.key === "ArrowUp"
            ? index < min
              ? max
              : Math.max(min, index)
            : index > max
              ? min
              : Math.min(max, index);

        setCursor(next);

        if (itemsRef.current) {
          let item = itemsRef.current.querySelector(`[data-index="${next}"]`);
          if (item) {
            item.scrollIntoView({ block: "nearest" });
          }
        }

        e.preventDefault();
      }
    },
    [cancelSearch, cursor, filtered, onItemClick],
  );

  const handleBlur = useCallback(() => {
    timerRef.current = setTimeout(() => {
      cancelSearch();
    }, 200);
  }, [cancelSearch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Fade in={canShow} mountOnEnter unmountOnExit>
      <div
        className={clsx(styles.menu, styles.search, {
          [styles.hover]: hover,
        })}
        data-testid={testId}
      >
        <div
          className={styles.header}
          data-testid={makeTestId(testId, "header")}
        >
          <div className={styles.text}>
            <TextField
              autoFocus
              placeholder={item.title}
              value={text}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              onBlur={filtered.length ? handleBlur : cancelSearch}
              icons={[
                {
                  icon: "search",
                },
              ]}
              data-testid={makeTestId(testId, "input")}
            />
          </div>
        </div>
        {show && (
          <Scrollable
            className={styles.items}
            ref={itemsRef}
            data-testid={makeTestId(testId, "results")}
          >
            {filtered.map((item, index) => (
              <div
                key={item.id}
                data-id={item.id}
                data-index={index}
                className={clsx(styles.itemWrapper, {
                  [styles.active]: index === cursor,
                })}
              >
                <MenuItem
                  key={item.id}
                  item={item}
                  state={{}}
                  onItemClick={onItemClick}
                  data-testid={makeTestId(testId, "result", item.id)}
                />
              </div>
            ))}
          </Scrollable>
        )}
      </div>
    </Fade>
  );
}
