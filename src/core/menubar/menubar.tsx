import BiCaretLeftFill from "bootstrap-icons/icons/caret-left-fill.svg?react";
import BiCaretRightFill from "bootstrap-icons/icons/caret-right-fill.svg?react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ArrowNavigation } from "../arrow-navigation";
import { isElementDisabled, isElementHidden } from "../arrow-navigation/utils";
import { Box } from "../box";
import { Button } from "../button";
import { Menu as AxMenu } from "../menu/menu";
import { MenuItem as AxMenuItem } from "../menu/menu-item";
import { withStyled } from "../styled";
import { useClassNames, useTheme } from "../styles";
import { tryFocus } from "./utils";

import { useForwardedRef } from "../hooks";
import { Portal } from "../portal";
import styles from "./menubar.module.scss";

const MenubarContext = React.createContext<any>({});

const useMenubar = () => useContext(MenubarContext);

function isSubmenu(menuItem: any) {
  return React.Children.toArray(menuItem.props.children).some(
    (child: any) => child.type === AxMenuItem,
  );
}

function getDefaultActive() {
  return { submenu: false, text: "" };
}

function Menu({
  children,
  className,
  show: showProp,
  onMouseLeave,
  onKeyDown,
  onHide,
  text,
  onShow,
  ...rest
}: any) {
  const [active, setActive] = useState<any>(getDefaultActive());

  const [show, setShow] = useState<boolean>(false);
  const menuRef = useRef<HTMLElement>(null);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  const { hideMenu: hideParentMenu, rtl } = useMenubar();

  const focusMenu = () => {
    tryFocus(menuRef.current);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    if ((active.text && !active.submenu) || (!show && active.text)) {
      setActive(getDefaultActive());
    }
    onMouseLeave && onMouseLeave(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const { key } = event;

    if (!(menuRef && menuRef.current)) return;

    const list = Array.from(menuRef.current.children);

    const getCurrentIndex = () => {
      return (
        active.text &&
        list.findIndex((item: any) => item.dataset.text === active.text)
      );
    };

    const getNextItem = () => {
      let index = active.text ? (getCurrentIndex() + 1) % list.length : 0;
      let element: any = null;

      while (!element) {
        const item = list[index] as HTMLElement;
        if (item && (isElementDisabled(item) || isElementHidden(item))) {
          index = (index + 1) % list.length;
        } else {
          element = item;
        }
      }

      return element;
    };

    const getPreviousItem = () => {
      let currentIndex = getCurrentIndex();

      const lastIndex = list.length - 1;

      let index = active.text
        ? currentIndex === 0
          ? lastIndex
          : currentIndex - 1
        : lastIndex;

      let element: any = null;

      while (!element) {
        const item = list[index] as HTMLElement;
        if (item && (isElementDisabled(item) || isElementHidden(item))) {
          index = index === 0 ? lastIndex : index - 1;
        } else {
          element = item;
        }
      }

      return element;
    };

    switch (key) {
      case "ArrowDown": {
        event.stopPropagation();
        const item = getNextItem();
        const { text, submenu }: any = item.dataset;
        tryFocus(item);
        setActive({ text, submenu });
        break;
      }
      case "ArrowUp": {
        event.stopPropagation();
        const item = getPreviousItem();
        const { text, submenu }: any = item.dataset;
        tryFocus(item);
        setActive({ text, submenu });
        break;
      }
      case "ArrowRight": {
        if (active.submenu && !rtl) {
          setShow(true);
        } else {
          onKeyDown && onKeyDown(event);
        }
        break;
      }
      case "ArrowLeft": {
        if (active.submenu && rtl) {
          setShow(true);
        } else {
          onKeyDown && onKeyDown(event);
        }
        break;
      }
      default: {
        onKeyDown && onKeyDown(event);
      }
    }
  };

  useEffect(() => {
    if (!showProp) {
      setActive(getDefaultActive());
      setShow(false);
    }
  }, [showProp]);

  useEffect(() => {
    if (showProp) {
      focusMenu();
    }
  }, [showProp]);

  const classNames = useClassNames();

  return (
    <>
      {text && (
        <Button
          variant="light"
          ref={setButtonRef}
          onClick={onShow}
          className={classNames(styles.btn, {
            [styles["active-btn"]]: show || showProp,
          })}
        >
          {text}
        </Button>
      )}
      <AxMenu
        placement={rtl ? "bottom-end" : "bottom-start"}
        disablePortal
        onHide={onHide}
        onKeyDown={handleKeyDown}
        onMouseLeave={handleMouseLeave}
        tabIndex={1}
        ref={menuRef}
        className={classNames(className, styles.menu)}
        show={showProp}
        target={buttonRef}
        rounded={false}
        {...rest}
      >
        {React.Children.map(children, (child) => {
          const { type, props } = child;

          if (type !== AxMenuItem) return child;

          const { text, onClick } = props;
          const isActiveItem = active.text === text;

          const submenu = isSubmenu(child);

          const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
            setActive({ text, submenu });

            if (submenu) {
              setShow(true);
            }
          };

          const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
            if (isActiveItem && submenu) {
              setShow(false);
            }
          };

          const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            if (submenu) {
              setActive({ text, submenu });
              setShow(true);
            } else {
              hideParentMenu();
            }
            onClick && onClick(event);
          };

          const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
            const { key } = event;
            const isSubmenuOpen = isActiveItem && show;

            const closeSubmenu = () => {
              event.stopPropagation();
              setShow(false);
              focusMenu();
            };

            switch (key) {
              case "Escape": {
                isSubmenuOpen && closeSubmenu();
                break;
              }
              case "ArrowLeft": {
                isSubmenuOpen && !rtl && closeSubmenu();
                break;
              }
              case "ArrowRight": {
                isSubmenuOpen && rtl && closeSubmenu();
                break;
              }
            }
          };

          const handleMenuKeyDown = (
            event: React.KeyboardEvent<HTMLElement>,
          ) => {
            const { key } = event;
            switch (key) {
              case "ArrowLeft": {
                if (rtl) {
                  onKeyDown && onKeyDown(event); // next/prev menu control
                }
                break;
              }
              case "ArrowRight": {
                if (!rtl) {
                  onKeyDown && onKeyDown(event); // next/prev menu control
                }
                break;
              }
            }
          };

          const common = {
            ...props,
            rtl,
            className: classNames(styles.item, {
              [styles.active]: isActiveItem,
            }),
            onClick: handleClick,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
          };

          return submenu ? (
            <MenuItem
              {...common}
              onKeyDown={handleKeyDown}
              MenuProps={{
                show: show && isActiveItem,
                onKeyDown: handleMenuKeyDown,
              }}
            />
          ) : (
            <AxMenuItem {...common} data-text={text} />
          );
        })}
      </AxMenu>
    </>
  );
}

function MenuItem({
  rtl,
  text,
  children,
  onMouseLeave,
  onMouseEnter,
  onKeyDown,
  MenuProps,
  ...rest
}: any) {
  const [target, setTarget] = useState(null);
  const selected = useRef("");

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (selected.current !== "submenu") {
        onMouseLeave();
      }
    },
    [onMouseLeave],
  );

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      selected.current = "submenu";
    },
    [],
  );

  const handleItemMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      selected.current = "item";
      onMouseEnter(event);
    },
    [onMouseEnter],
  );

  const { menubarRef } = useMenubar();

  return (
    <div
      tabIndex={-1}
      data-text={text}
      data-submenu={true}
      onMouseLeave={handleMouseLeave}
      onKeyDown={onKeyDown}
      className={styles.menu}
    >
      <AxMenuItem
        {...rest}
        text={text}
        ref={setTarget}
        endIcon={rtl ? BiCaretLeftFill : BiCaretRightFill}
        onMouseEnter={handleItemMouseEnter}
      />
      <Portal container={menubarRef.current}>
        <Menu
          target={target}
          placement={rtl ? "start-top" : "end-top"}
          onMouseEnter={handleMouseEnter}
          {...MenuProps}
        >
          {children}
        </Menu>
      </Portal>
    </div>
  );
}

export const Menubar = withStyled(Box)((props, ref) => {
  const [active, setActive] = useState<string | undefined>(undefined);
  const [show, setShow] = useState<boolean>(false);
  const { children } = props;

  const { dir } = useTheme();
  const rtl = dir === "rtl";

  const [beforeElements, menus, afterElements] = useMemo(() => {
    const all = React.Children.toArray(children).flat();
    const menuStartIndex = all.findIndex(
      (item: any) => item && item.type === AxMenu,
    );
    return [
      all.slice(0, menuStartIndex),
      all.filter((child: any) => child.type === AxMenu && child.props.text),
      all.slice(menuStartIndex).filter((item: any) => item?.type !== AxMenu),
    ];
  }, [children]);

  const showMenu = useCallback((text: string) => {
    setActive(text);
    setShow(true);
  }, []);

  const hideMenu = useCallback(
    (text?: string) => {
      if (text && active !== text) return;
      setActive(text);
      setShow(false);
    },
    [active],
  );

  const getCurrentIndex = useCallback(
    () => menus.findIndex((item: any) => item.props.text === active),
    [menus, active],
  );

  const showNext = useCallback(() => {
    const current = getCurrentIndex();
    const menu: any = menus[(current + 1) % menus.length];
    showMenu(menu.props.text);
  }, [menus, showMenu, getCurrentIndex]);

  const showPrevious = useCallback(() => {
    const current = getCurrentIndex();
    const menu: any = menus[current === 0 ? menus.length - 1 : current - 1];
    showMenu(menu.props.text);
  }, [menus, showMenu, getCurrentIndex]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const { key } = event;
      switch (key) {
        case "ArrowRight": {
          const action = rtl ? showPrevious : showNext;
          action();
          break;
        }
        case "ArrowLeft": {
          const action = rtl ? showNext : showPrevious;
          action();
          break;
        }
        case "Escape": {
          hideMenu();
          break;
        }
        case "Tab": {
          event.preventDefault();
          if (event.shiftKey) {
            showPrevious();
          } else {
            showNext();
          }
        }
      }
    },
    [rtl, showNext, showPrevious, hideMenu],
  );

  const menubarRef = useForwardedRef<HTMLDivElement>(ref);
  const value = useMemo(
    () => ({ rtl, menubarRef, hideMenu }),
    [rtl, menubarRef, hideMenu],
  );

  return (
    <MenubarContext.Provider value={value}>
      <ArrowNavigation selector="auto-horizontal">
        <Box ref={menubarRef} d="flex" {...props}>
          {beforeElements}
          {menus.map((menu: any) => {
            const { text, onShow, onHide } = menu.props;

            const handleShow = (event: React.MouseEvent<HTMLElement>) => {
              showMenu(text);
              onShow && onShow(event);
            };

            const handleHide = (event: React.SyntheticEvent) => {
              hideMenu(text);
              onHide && onHide(event);
            };

            return (
              <Menu
                {...menu.props}
                key={text}
                show={show && active === text}
                onShow={handleShow}
                onHide={handleHide}
                onKeyDown={handleKeyDown}
              />
            );
          })}
          {afterElements}
        </Box>
      </ArrowNavigation>
    </MenubarContext.Provider>
  );
});
