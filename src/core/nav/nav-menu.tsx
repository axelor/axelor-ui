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
  const showMenus = mode === "accordion";

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
      {showIcons && (
        <Icons
          mode={mode}
          show={show}
          items={menus}
          searchOptions={searchOptions}
          searchActive={searchActive}
          onItemClick={onItemClick}
        />
      )}
      {showMenus && (
        <Accordion
          mode={mode}
          show={show}
          items={menus}
          searchOptions={searchOptions}
          searchActive={searchActive}
          onItemClick={onItemClick}
        />
      )}
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
  active?: boolean;
  hover?: boolean;
  onItemClick?: (item: NavMenuItem) => void;
  onItemHover?: (item: NavMenuItem) => void;
}

interface VariantProps extends NavMenuProps {
  onItemHover?: (item: NavMenuItem) => void;
}

function Accordion({
  show,
  items,
  searchOptions,
  searchActive,
  onItemClick,
}: VariantProps) {
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  const { searchEnabled, searchToggle, searchItem } = useMemo(
    () =>
      findSearchOptions({
        items,
        searchOptions,
      }),
    [items, searchOptions]
  );

  const [showSearch, setShowSearch] = useState(searchActive);

  const showIcons = show === "icons";

  useEffect(() => {
    setShowSearch(searchActive);
  }, [searchActive]);

  const handleClick = useCallback(
    (item: NavMenuNode) => {
      const id = item.rootId || item.id;
      if (id !== active) {
        setActive(id);
      }

      onItemClick?.(item);

      if (show === "icons" && (item.items || []).length === 0) {
        setHover(false);
      }

      if (showSearch) {
        setShowSearch(false);
        searchToggle(false);
      }
    },
    [active, onItemClick, searchToggle, show, showSearch]
  );

  const handleEnter = useCallback(() => {
    if (!hover) {
      setHover(true);
    }
  }, [hover]);

  const handleLeave = useCallback(() => {
    setHover(false);
    setShowSearch(false);
    searchToggle(false);
  }, [searchToggle]);

  const handleSearch = useCallback(() => {
    setShowSearch(true);
    searchToggle(true);
  }, [searchToggle]);

  let canShowSearch = searchEnabled && showSearch;

  return (
    <div
      className={clsx(styles.accordion, {
        [styles.hover]: hover || (show === "icons" && showSearch),
      })}
      onMouseMove={handleEnter}
      onMouseLeave={handleLeave}
    >
      {showIcons && <MenuIcons mode="icons" show="icons" items={items} />}
      {canShowSearch && (
        <div className={styles.menus}>
          <SearchMenu
            item={searchItem}
            hover={true}
            onItemClick={handleClick}
          />
        </div>
      )}
      <div
        className={clsx(styles.menus, {
          [styles.hide]: canShowSearch,
        })}
      >
        {searchEnabled && (
          <div className={styles.searchWrapper}>
            <MaterialIcon
              className={styles.searchToggle}
              icon="keyboard_arrow_down"
              fontSize="16px"
              onClick={handleSearch}
            />
          </div>
        )}
        {items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            active={item.id === active}
            onItemClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}

function Icons({
  items,
  searchOptions,
  searchActive,
  onItemClick,
}: VariantProps) {
  const first = useMemo(() => (items.length ? items[0].id : null), [items]);

  const [active, setActive] = useState<string | null>(first);
  const [hover, setHover] = useState<string | null>(null);

  const { searchEnabled, searchItem, searchToggle } = useMemo(
    () => findSearchOptions({ searchOptions, items }),
    [items, searchOptions]
  );

  const [showSearch, setShowSearch] = useState(searchActive);

  useEffect(() => {
    setShowSearch(searchActive);
  }, [searchActive]);

  const icons = useMemo(
    () => (searchEnabled ? [searchItem, ...items] : items),
    [items, searchEnabled, searchItem]
  );

  const handleIconClick = useCallback(
    (item: NavMenuNode) => {
      if (item.id === searchItem.id) return;
      setActive(item.id);
      setHover(null);
    },
    [searchItem.id]
  );

  const handleIconHover = useCallback(
    (item: NavMenuNode) => {
      setHover(item.id);
      if (searchEnabled && item.id === searchItem.id) {
        setShowSearch(true);
        searchToggle(true);
      } else {
        setShowSearch(false);
        searchToggle(false);
      }
    },
    [searchEnabled, searchItem.id, searchToggle]
  );

  const handleLeave = useCallback(() => {
    setHover(null);
    setShowSearch(false);
    searchToggle(false);
  }, [searchToggle]);

  const handleItemClick = useCallback(
    (item: NavMenuNode) => {
      const id = item.rootId || item.id;
      if (id !== active) {
        setActive(id);
      }

      if ((item.items || []).length === 0) {
        setHover(null);
      }

      setShowSearch(false);
      searchToggle(false);

      onItemClick?.(item);
    },
    [active, onItemClick, searchToggle]
  );

  const canShowSearch =
    searchEnabled && (searchItem.id === hover || showSearch);

  const hoverId = canShowSearch ? searchItem.id : hover;

  return (
    <div
      className={clsx(styles.buttons, {
        [styles.hover]: hoverId,
      })}
      onMouseLeave={handleLeave}
    >
      <MenuIcons
        mode="icons"
        show="icons"
        items={icons}
        onItemClick={handleIconClick}
        onItemHover={handleIconHover}
      />
      <div className={styles.menusWrapper}>
        <div className={styles.menus}>
          {canShowSearch && (
            <SearchMenu
              item={searchItem}
              hover={true}
              onItemClick={handleItemClick}
            />
          )}
          {items.map((item) => (
            <Menu
              key={item.id}
              item={item}
              active={item.id === (hoverId || active)}
              hover={item.id === hoverId}
              onItemClick={handleItemClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Menu({ item, active, hover, onItemClick }: ItemProps) {
  const { title } = item;
  return (
    <div
      className={clsx(styles.menu, {
        [styles.active]: active,
        [styles.hover]: hover,
      })}
    >
      <div className={styles.header}>{title}</div>
      <MenuItems
        item={item}
        active={active || hover}
        onItemClick={onItemClick}
      />
    </div>
  );
}

function UnknownIcon() {
  return <MaterialIcon icon="question_mark" />;
}

function MenuIcon({ item, onItemClick, onItemHover }: ItemProps) {
  const { icon, iconColor } = item;
  const Icon = icon || UnknownIcon;
  const bg = useMemo(() => iconColor && getRGB(iconColor, 0.15), [iconColor]);

  const handleClick = useCallback(() => {
    onItemClick?.(item);
  }, [item, onItemClick]);

  const handleHover = useCallback(() => {
    onItemHover?.(item);
  }, [item, onItemHover]);

  return (
    <div
      className={styles.icon}
      style={
        {
          "--bs-nav-menu-icon-bg": bg,
          "--bs-nav-menu-icon-color": iconColor,
        } as any
      }
      onClick={handleClick}
      onMouseOver={handleHover}
    >
      <Icon color={iconColor} />
    </div>
  );
}

function MenuIcons({ items, onItemClick, onItemHover }: VariantProps) {
  return (
    <div className={styles.icons}>
      {items.map((item) => (
        <MenuIcon
          key={item.id}
          item={item}
          onItemClick={onItemClick}
          onItemHover={onItemHover}
        />
      ))}
    </div>
  );
}

function MenuItem({ item, active, onItemClick }: ItemProps) {
  const { icon, tag: Tag, tagColor, title, items = [], onClick } = item;

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

  const isOpen = active && open;

  return (
    <div
      className={clsx(styles.item, {
        [styles.open]: isOpen,
      })}
    >
      <div className={styles.title} onClick={handleClick}>
        {hasIcon && <MenuIcon item={item} />}
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
        <Collapse in={isOpen} mountOnEnter unmountOnExit>
          <MenuItems item={item} active={active} onItemClick={onItemClick} />
        </Collapse>
      )}
    </div>
  );
}

function MenuItems({ item, active, onItemClick }: ItemProps) {
  const { items = [] } = item;
  return (
    <div className={styles.items}>
      {items.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          active={active}
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

function findSearchOptions({
  items,
  searchOptions,
}: Pick<NavMenuProps, "items" | "searchOptions">) {
  const { title = "search", onShow, onHide } = searchOptions ?? {};
  const searchEnabled = Boolean(searchOptions);
  const searchItem = {
    id: "-1009",
    title: title,
    icon: () => <MaterialIcon icon="search" />,
    items,
  };

  const searchToggle = (active: boolean) => {
    active ? onShow?.() : onHide?.();
  };

  return {
    searchEnabled,
    searchItem,
    searchToggle,
  };
}

function SearchMenu({ item, hover, onItemClick }: ItemProps) {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");

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
              <MenuItem key={item.id} item={item} onItemClick={onItemClick} />
            ))}
          </div>
        )}
      </div>
    </Fade>
  );
}
