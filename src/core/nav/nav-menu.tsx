import { useCallback, useEffect, useMemo, useState } from "react";

import { MaterialIcon } from "../../icons/material-icon";
import { clsx } from "../clsx";
import { Collapse } from "../collapse";
import { Fade } from "../fade";
import { TextField } from "../text-field";
import { getRGB } from "./utils";

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

  style?: React.CSSProperties;

  className?: string;
}

export function NavMenu({
  mode,
  show,
  items,
  style,
  className,
  searchOptions,
  searchActive,
  onItemClick,
}: NavMenuProps) {
  const menus = useMemo(() => items.map((item) => walk(item)), [items]);
  const showIcons = mode === "icons";
  const Comp = showIcons ? Icons : Accordion;
  return (
    <div
      className={clsx(
        className,
        styles.nav,
        styles[`mode-${mode}`],
        styles[`show-${show}`]
      )}
      style={style}
    >
      <Comp
        mode={mode}
        show={show}
        items={menus}
        searchOptions={searchOptions}
        searchActive={searchActive}
        onItemClick={onItemClick}
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
      title: searchOptions?.title ?? "Search",
      icon: () => <MaterialIcon icon="search" />,
      items,
    }),
    [items, searchOptions?.title]
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
    [searchEnabled, searchItem.id, searchOptions, showSearch]
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
    setShowSearch(false);
  }, [setShowSearch]);

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
    [mode, onItemClick, searchItem, setShowSearch]
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
    [onItemClick, searchItem, setShowSearch]
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
    [searchEnabled, searchItem.id, setShowSearch]
  );

  const handleSearchClick = useCallback(() => {
    setShowSearch(true);
  }, [setShowSearch]);

  const state = useMemo(
    () => ({ active, lookup, selected }),
    [active, lookup, selected]
  );

  return {
    mode,
    show,
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

  return (
    <div
      className={clsx(styles.accordion, {
        [styles.hover]: lookup || (showIcons && showSearch),
      })}
      onMouseMove={handleEnter}
      onMouseLeave={handleLeave}
    >
      {showIcons && (
        <MenuIcons mode="icons" show="icons" state={state} items={items} />
      )}
      {showSearch && (
        <div className={styles.menus}>
          <SearchMenu
            item={searchItem}
            state={state}
            onItemClick={handleItemClick}
          />
        </div>
      )}
      <div
        className={clsx(styles.menus, {
          [styles.hide]: showSearch,
        })}
      >
        {searchEnabled && (
          <div className={styles.searchWrapper}>
            <MaterialIcon
              className={styles.searchToggle}
              icon="keyboard_arrow_down"
              fontSize="16px"
              onClick={handleSearchClick}
            />
          </div>
        )}
        {items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            state={state}
            onItemClick={handleItemClick}
          />
        ))}
      </div>
    </div>
  );
}

function Icons(props: VariantProps) {
  const {
    state,
    items,
    showSearch,
    searchItem,
    searchEnabled,
    handleLeave,
    handleItemClick,
    handleIconClick,
    handleIconHover,
  } = useNavMenu(props);

  const hover = showSearch ? searchItem.id : state.lookup;

  const icons = useMemo(
    () => (searchEnabled ? [searchItem, ...items] : items),
    [items, searchEnabled, searchItem]
  );

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
        onItemClick={handleIconClick}
        onItemHover={handleIconHover}
      />
      <div className={styles.menusWrapper}>
        <div className={styles.menus}>
          {showSearch && (
            <SearchMenu
              item={searchItem}
              state={state}
              onItemClick={handleItemClick}
            />
          )}
          {items.map((item) => (
            <Menu
              key={item.id}
              item={item}
              state={state}
              onItemClick={handleItemClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Menu({ item, state, onItemClick }: ItemProps) {
  const { id, title } = item;

  const active = state.lookup ? false : state.active === id;
  const hover = state.lookup === id;

  return (
    <div
      className={clsx(styles.menu, {
        [styles.active]: active,
        [styles.hover]: hover,
      })}
    >
      <div className={styles.header}>
        <MenuIcon item={item} state={{}} />
        <div className={styles.text}>{title}</div>
      </div>
      <MenuItems item={item} state={state} onItemClick={onItemClick} />
    </div>
  );
}

function UnknownIcon() {
  return <MaterialIcon icon="question_mark" />;
}

function MenuIcon({ item, state, onItemClick, onItemHover }: ItemProps) {
  const { icon, iconColor } = item;
  const Icon = icon || UnknownIcon;

  const hoverBg = useMemo(
    () => iconColor && getRGB(iconColor, 0.25),
    [iconColor]
  );
  const activeBg = useMemo(
    () => iconColor && getRGB(iconColor, 0.15),
    [iconColor]
  );

  const active = item.id === state.active;
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
        [styles.active]: active,
        [styles.hover]: hover,
      })}
      style={
        {
          "--ax-nav-menu-icon-hover-bg": hoverBg,
          "--ax-nav-menu-icon-hover-color": iconColor,
          "--ax-nav-menu-icon-active-bg": activeBg,
          "--ax-nav-menu-icon-active-color": iconColor,
          "--ax-nav-menu-icon-color": iconColor,
        } as any
      }
      onClick={handleClick}
      onMouseOver={handleHover}
    >
      <Icon color={iconColor} />
    </div>
  );
}

function MenuIcons({
  items,
  state,
  onItemClick,
  onItemHover,
}: VariantProps & { state: ItemProps["state"] }) {
  return (
    <div className={styles.icons}>
      {items.map((item) => (
        <MenuIcon
          key={item.id}
          item={item}
          state={state}
          onItemClick={onItemClick}
          onItemHover={onItemHover}
        />
      ))}
    </div>
  );
}

function MenuItem({ item, state, onItemClick }: ItemProps) {
  const node: NavMenuNode = item;
  const { icon, tag: Tag, tagColor, title, items = [], onClick } = item;

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
    >
      <div className={styles.title} onClick={handleClick}>
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
      {hasItems && (
        <Collapse in={open} mountOnEnter unmountOnExit>
          <MenuItems item={item} state={state} onItemClick={onItemClick} />
        </Collapse>
      )}
    </div>
  );
}

function MenuItems({ item, state, onItemClick }: ItemProps) {
  const { items = [] } = item;
  return (
    <div className={styles.items}>
      {items.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          state={state}
          onItemClick={onItemClick}
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

function SearchMenu({ item, state, onItemClick }: ItemProps) {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");

  const hover = true;

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    setShow(!!value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Escape") {
        onItemClick?.({ id: "", title: "" });
      }
    },
    [onItemClick]
  );

  const items = useMemo(
    () => item.items?.flatMap((x) => flattenItem(x)).flat(),
    [item]
  );

  const filterd = useMemo(() => {
    if (show && items) {
      return items.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
    }
    return [];
  }, [items, show, text]);

  const canShow = hover ?? false;

  return (
    <Fade in={canShow} mountOnEnter unmountOnExit>
      <div
        className={clsx(styles.menu, styles.search, {
          [styles.hover]: hover,
        })}
      >
        <div className={styles.header}>
          <div className={styles.text}>
            <TextField
              autoFocus
              value={text}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              icons={[
                {
                  icon: "search",
                },
              ]}
            />
          </div>
        </div>
        {show && (
          <div className={styles.items}>
            {filterd.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                state={state}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>
    </Fade>
  );
}
