import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import { MaterialIcon } from "../../icons/material-icon";
import { clsx } from "../clsx";
import { useTheme } from "../styles";
import { getRGB } from "./utils";

import styles from "./nav-tabs.module.scss";

export interface NavTabItem {
  /**
   * The item id should be unique among all the tab items.
   *
   */
  id: string;

  /**
   * The display title.
   *
   */
  title: React.ReactNode;

  /**
   * The icon to show.
   */
  icon?: React.FC<{ color?: string }>;

  /**
   * The renderer to customize tab rendering
   */
  render?: React.FC<{
    item: NavTabItem;
    active?: boolean;
    className?: string;
    children?: React.ReactNode;
  }>;

  /**
   * The color for the icon.
   *
   */
  iconColor?: string;

  /**
   * The click handler.
   *
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * The auxclick handler.
   */
  onAuxClick?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * The context menu handler.
   *
   */
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
}

export interface NavTabsProps {
  /**
   * List of tabs.
   *
   */
  items: NavTabItem[];

  /**
   * The id of the active tab.
   */
  active?: string;

  /**
   * The class name.
   */
  className?: string;

  /**
   * The click event handler.
   *
   */
  onItemClick?: (item: NavTabItem) => void;
}

type ContextValue = {
  active: string | null;
  activeElement: HTMLElement | null;
  setActive: (
    id: string | null,
    element: HTMLElement | null,
    persist?: boolean,
  ) => void;
};

const NavTabsContext = createContext<ContextValue>({
  active: null,
  activeElement: null,
  setActive: () => {},
});

const useTabs = () => {
  const { active, activeElement, setActive } = useContext(NavTabsContext);
  return {
    active,
    activeElement,
    setActive,
  };
};

export const NavTabs = forwardRef<HTMLDivElement, NavTabsProps>(
  (props, ref) => {
    const { className, items, onItemClick } = props;

    const isRtl = useTheme().dir === "rtl";

    const [indicator, setIndicator] = useState<{ x: number; w: number }>({
      x: 0,
      w: 0,
    });

    const [stripElement, stripRef] = useState<HTMLDivElement | null>(null);
    const [startArrow, setStartArrow] = useState(false);
    const [endArrow, setEndArrow] = useState(false);

    const [active, setActiveTab] = useState<string | null>(() => {
      return props.active ?? items.find(Boolean)?.id ?? null;
    });

    const [activeElement, setActiveElement] = useState<HTMLElement | null>(
      null,
    );

    const scrollIn = useCallback(
      (element: HTMLElement) => {
        if (stripElement) {
          const left = element.offsetLeft;
          const right = left + element.offsetWidth;
          const scrollLeft = stripElement.scrollLeft;
          const scrollRight = scrollLeft + stripElement.clientWidth;

          const diff =
            right > scrollRight
              ? right - scrollRight
              : left < scrollLeft
                ? -(scrollLeft - left)
                : 0;

          if (diff) {
            stripElement.scroll({
              left: scrollLeft + diff,
              behavior: "smooth",
            });
          }
        }
      },
      [stripElement],
    );

    const setActive = useCallback(
      (id: string | null, element: HTMLElement | null, persist = true) => {
        persist && setActiveTab(id);
        setActiveElement(element);
        if (element) {
          scrollIn(element);
        }
      },
      [scrollIn],
    );

    const handleItemClick = useCallback(
      (item: NavTabItem) => {
        onItemClick?.(item);
      },
      [onItemClick],
    );

    const activateScrollArrows = useCallback(() => {
      const elem = stripElement;
      if (elem) {
        const start = isRtl ? Math.abs(elem.scrollLeft) : elem.scrollLeft;
        const width = elem.clientWidth;
        const end = elem.scrollWidth - width - start;

        setStartArrow(start > 0);
        setEndArrow(end > 0);
      }
    }, [isRtl, stripElement]);

    const getScrollSize = useCallback(() => {
      if (stripElement && stripElement.firstChild) {
        const elems = Array.from(
          (stripElement.firstChild as HTMLElement).children,
        );
        const max = stripElement.clientWidth;
        let size = 0;
        for (let i = 0; i < elems.length; i++) {
          const elem = elems[i] as HTMLElement;
          const elemSize = elem.offsetWidth;
          size += elemSize;
          if (size > max) {
            break;
          }
        }
        return Math.max(max, size);
      }
      return 0;
    }, [stripElement]);

    const onScrollToStart = useCallback(() => {
      if (stripElement) {
        stripElement.scroll({
          left: isRtl
            ? stripElement.scrollLeft - getScrollSize()
            : stripElement.scrollLeft + getScrollSize(),
          behavior: "smooth",
        });
      }
    }, [getScrollSize, isRtl, stripElement]);

    const onScrollToEnd = useCallback(() => {
      if (stripElement) {
        stripElement.scroll({
          left: isRtl
            ? stripElement.scrollLeft + getScrollSize()
            : stripElement.scrollLeft - getScrollSize(),
          behavior: "smooth",
        });
      }
    }, [getScrollSize, isRtl, stripElement]);

    useLayoutEffect(() => {
      if (activeElement && stripElement) {
        const observer = new ResizeObserver(() => {
          const x = isRtl
            ? stripElement.clientWidth -
              activeElement.offsetLeft -
              activeElement.offsetWidth
            : activeElement.offsetLeft;
          const w = activeElement.offsetWidth;
          if (w > 0) {
            setIndicator({ x, w });
          }
        });
        observer.observe(activeElement);
        return () => {
          observer.disconnect();
        };
      }
    }, [activeElement, isRtl, stripElement, items]);

    useLayoutEffect(() => {
      if (stripElement) {
        const observer = new ResizeObserver(() => {
          activateScrollArrows();
        });
        observer.observe(stripElement);
        return () => {
          observer.disconnect();
        };
      }
    }, [activateScrollArrows, stripElement, items]);

    useEffect(() => {
      if (props.active !== active) {
        setActive(props.active ?? null, null);
      }
    }, [active, props.active, setActive]);

    return (
      <NavTabsContext.Provider value={{ active, activeElement, setActive }}>
        <div className={clsx(className, styles.container)} ref={ref}>
          <div
            className={clsx(styles.button, styles.start, {
              [styles.active]: startArrow,
            })}
          >
            <MaterialIcon
              className={styles.arrow}
              icon={isRtl ? "keyboard_arrow_right" : "keyboard_arrow_left"}
              onClick={onScrollToEnd}
            />
          </div>
          <div
            ref={stripRef}
            className={styles.strip}
            onScroll={activateScrollArrows}
          >
            <div className={styles.tabs}>
              {items.map((item) => (
                <NavTab
                  key={item.id}
                  item={item}
                  onItemClick={handleItemClick}
                />
              ))}
            </div>
            <div
              className={styles.indicator}
              style={
                isRtl
                  ? {
                      right: indicator.x,
                      width: indicator.w,
                    }
                  : {
                      left: indicator.x,
                      width: indicator.w,
                    }
              }
            ></div>
          </div>
          <div
            className={clsx(styles.button, styles.end, {
              [styles.active]: endArrow,
            })}
          >
            <MaterialIcon
              className={styles.arrow}
              icon={isRtl ? "keyboard_arrow_left" : "keyboard_arrow_right"}
              onClick={onScrollToStart}
            />
          </div>
        </div>
      </NavTabsContext.Provider>
    );
  },
);

interface NavTabProps {
  item: NavTabItem;
  onItemClick?: (item: NavTabItem) => void;
}

function NavTab(props: NavTabProps) {
  const { item, onItemClick } = props;
  const { icon, title, render, onClick, onAuxClick, onContextMenu } = item;

  const { active, setActive } = useTabs();
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const isActive = active === item.id;

  const handleClick = useCallback<React.MouseEventHandler<HTMLDivElement>>(
    (e) => {
      setActive(item.id, element);
      onItemClick?.(item);
      onClick?.(e);
    },
    [element, item, onClick, onItemClick, setActive],
  );

  useEffect(() => {
    if (isActive) {
      setActive(item.id, element, false);
    }
  }, [element, isActive, item.id, setActive]);

  return (
    <div
      ref={setElement}
      className={clsx(styles.tab, {
        [styles.active]: isActive,
      })}
      data-tab-id={item.id}
      onClick={handleClick}
      onAuxClick={onAuxClick}
      onContextMenu={onContextMenu}
    >
      <NavTabInner item={item} active={isActive} />
    </div>
  );
}

function NavTabInner(props: { item: NavTabItem; active?: boolean }) {
  const { item, active } = props;
  const { icon, title, render: Title } = item;
  if (Title) {
    return (
      <Title item={item} active={active} className={styles.title}>
        {icon && <NavTabIcon item={item} />}
        {title && <div className={styles.text}>{title}</div>}
      </Title>
    );
  }
  return (
    <div className={styles.title}>
      {icon && <NavTabIcon item={item} />}
      {title && <div className={styles.text}>{title}</div>}
    </div>
  );
}

function NavTabIcon(props: NavTabProps) {
  const { item } = props;
  const { icon: Icon, iconColor } = item;
  const bg = useMemo(() => iconColor && getRGB(iconColor, 0.1), [iconColor]);
  const hoverBg = useMemo(
    () => iconColor && getRGB(iconColor, 0.2),
    [iconColor],
  );
  const activeBg = useMemo(
    () => iconColor && getRGB(iconColor, 0.2),
    [iconColor],
  );
  return (
    Icon && (
      <div
        className={styles.icon}
        style={
          {
            "--ax-nav-tabs-icon-bg": bg,
            "--ax-nav-tabs-icon-color": iconColor,
            "--ax-nav-tabs-icon-hover-bg": hoverBg,
            "--ax-nav-tabs-icon-hover-color": iconColor,
            "--ax-nav-tabs-icon-active-bg": activeBg,
            "--ax-nav-tabs-icon-active-color": iconColor,
          } as any
        }
      >
        <Icon color={iconColor} />
      </div>
    )
  );
}
