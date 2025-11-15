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
import { useControlled } from "../hooks/use-controlled";
import { useTheme } from "../styles";
import { findAriaProp, findDataProp, makeTestId } from "../system/utils";
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
   * Associate any data
   *
   */
  data?: any;

  /**
   * The HTML properties.
   */
  htmlProps?: {
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-controls"?: string;
    "data-testid"?: string;
  };

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
  active?: string | null;

  /**
   * The class name.
   */
  className?: string;

  /**
   * The click event handler.
   *
   */
  onItemClick?: (item: NavTabItem) => void;

  /**
   * The item select change handler.
   *
   * @param item the selected item
   *
   */
  onItemSelect?: (item?: NavTabItem) => void;
}

type ContextValue = {
  active: string | null | undefined;
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
    const { className, items, onItemClick, onItemSelect } = props;

    const testId = findDataProp(props, "data-testid");
    const isRtl = useTheme().dir === "rtl";

    const [indicator, setIndicator] = useState<{ x: number; w: number }>({
      x: 0,
      w: 0,
    });

    const [stripElement, stripRef] = useState<HTMLDivElement | null>(null);
    const [startArrow, setStartArrow] = useState(false);
    const [endArrow, setEndArrow] = useState(false);

    const [active, setActiveTab] = useControlled<string | null>({
      name: "NavTabs",
      prop: "active",
      state: props.active,
      defaultState: items?.[0]?.id,
    });

    const [activeElement, setActiveElement] = useState<HTMLElement | null>(
      null,
    );

    const scrollIn = useCallback(
      (element: HTMLElement) => {
        if (stripElement) {
          const stripRect = stripElement.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();

          const isClippedLeft = elementRect.left < stripRect.left;
          const isClippedRight = elementRect.right > stripRect.right;

          let scrollLeft = stripElement.scrollLeft;
          if (isClippedLeft) {
            scrollLeft -= stripRect.left - elementRect.left;
          } else if (isClippedRight) {
            scrollLeft += elementRect.right - stripRect.right;
          } else {
            return;
          }

          scrollLeft = isRtl ? Math.floor(scrollLeft) : Math.ceil(scrollLeft);

          if (scrollLeft !== stripElement.scrollLeft) {
            stripElement.scroll({
              left: scrollLeft,
              behavior: "smooth",
            });
          }
        }
      },
      [isRtl, stripElement],
    );

    const setActive = useCallback(
      (id: string | null, element: HTMLElement | null, persist = true) => {
        persist && setActiveTab(id);
        setActiveElement(element);
        onItemSelect?.(items.find((x) => x.id === id));
        if (element) {
          scrollIn(element);
        }
      },
      [items, onItemSelect, scrollIn, setActiveTab],
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
        const width = elem.clientWidth;
        const start = Math.ceil(
          isRtl ? Math.abs(elem.scrollLeft) : elem.scrollLeft,
        );
        const end = Math.ceil(elem.scrollWidth - width - start);

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
              activeElement.clientWidth
            : activeElement.offsetLeft;
          const w = activeElement.offsetWidth;
          if (w > 0) {
            setIndicator({ x: x + 1, w: w - 2 });
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

    return (
      <NavTabsContext.Provider value={{ active, activeElement, setActive }}>
        <div
          className={clsx(className, styles.container)}
          ref={ref}
          data-testid={testId}
        >
          <div
            className={clsx(styles.button, styles.start, {
              [styles.active]: startArrow,
            })}
            data-testid={makeTestId(testId, "start-arrow")}
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
            <div className={styles.tabs} role="tablist">
              {items.map((item) => (
                <NavTab
                  key={item.id}
                  item={item}
                  onItemClick={handleItemClick}
                  stripElement={stripElement}
                  data-testid={makeTestId(testId, "tab", item.id)}
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
              data-testid={makeTestId(testId, "indicator")}
            ></div>
          </div>
          <div
            className={clsx(styles.button, styles.end, {
              [styles.active]: endArrow,
            })}
            data-testid={makeTestId(testId, "end-arrow")}
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
  stripElement?: HTMLElement | null;
}

function NavTab(props: NavTabProps) {
  const { item, onItemClick, stripElement } = props;
  const { htmlProps = {}, onClick, onAuxClick, onContextMenu } = item;

  const id = htmlProps.id;
  const ariaLabel = findAriaProp(htmlProps, "aria-label");
  const ariaLabelledby = findAriaProp(htmlProps, "aria-labelledby");
  const ariaControls = findAriaProp(htmlProps, "aria-controls");
  const testId =
    findDataProp(htmlProps, "data-testid") ||
    findDataProp(props, "data-testid");

  const { active, setActive } = useTabs();
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const isActive = active === item.id;
  const isRtl = useTheme().dir === "rtl";

  const scrollTab = useCallback((tab: HTMLElement, strip: HTMLElement) => {
    const stripRect = strip.getBoundingClientRect();
    const elementRect = tab.getBoundingClientRect();

    const isClippedLeft = elementRect.left < stripRect.left;
    const isClippedRight = elementRect.right > stripRect.right;

    if (isClippedLeft || isClippedRight) {
      let scrollLeft = strip.scrollLeft;
      if (isClippedLeft) {
        scrollLeft -= stripRect.left - elementRect.left;
      } else {
        scrollLeft += elementRect.right - stripRect.right;
      }
      strip.scroll({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  const handleClick = useCallback<React.MouseEventHandler<HTMLDivElement>>(
    (e) => {
      setActive(item.id, element);
      onItemClick?.(item);
      onClick?.(e);
    },
    [element, item, onClick, onItemClick, setActive],
  );

  const handleKeyDown = useCallback<React.KeyboardEventHandler<HTMLDivElement>>(
    (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const previousSibling = isRtl ? "nextSibling" : "previousSibling";
        const nextSibling = isRtl ? "previousSibling" : "nextSibling";
        const lastChild = isRtl ? "firstChild" : "lastChild";
        const firstChild = isRtl ? "lastChild" : "firstChild";
        let next =
          event.key === "ArrowLeft"
            ? element?.[previousSibling]
            : element?.[nextSibling];
        if (next == null) {
          next =
            event.key === "ArrowLeft"
              ? element?.parentElement?.[lastChild]
              : element?.parentElement?.[firstChild];
        }
        (next as HTMLElement)?.focus();
        if (next && stripElement) {
          scrollTab(next as HTMLElement, stripElement);
        }
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        element?.click();
      }
    },
    [element, isRtl, scrollTab, stripElement],
  );

  useEffect(() => {
    if (isActive) {
      setActive(item.id, element, false);
    }
  }, [element, isActive, item.id, setActive]);

  return (
    <div
      id={id}
      ref={setElement}
      className={clsx(styles.tab, {
        [styles.active]: isActive,
      })}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      aria-selected={isActive ? "true" : "false"}
      aria-controls={ariaControls}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      data-tab-id={item.id}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onAuxClick={onAuxClick}
      onContextMenu={onContextMenu}
      data-testid={testId}
    >
      <NavTabInner item={item} active={isActive} data-testid={testId} />
    </div>
  );
}

function NavTabInner(props: { item: NavTabItem; active?: boolean }) {
  const { item, active } = props;
  const { icon, title, render: Title } = item;
  const testId = findDataProp(props, "data-testid");
  if (Title) {
    return (
      <Title item={item} active={active} className={styles.title}>
        {icon && <NavTabIcon item={item} data-testid={testId} />}
        {title && <div className={styles.text}>{title}</div>}
      </Title>
    );
  }
  return (
    <div className={styles.title}>
      {icon && <NavTabIcon item={item} data-testid={testId} />}
      {title && <div className={styles.text}>{title}</div>}
    </div>
  );
}

function NavTabIcon(props: NavTabProps) {
  const { item } = props;
  const { icon: Icon, iconColor } = item;
  const testId = findDataProp(props, "data-testid");
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
        data-testid={makeTestId(testId, "icon")}
      >
        <Icon color={iconColor} />
      </div>
    )
  );
}
