import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ReactComponent as BiCaretRightFill } from 'bootstrap-icons/icons/caret-right-fill.svg';

import { Box } from '../box';
import { Menu as AxMenu } from '../menu/menu';
import { ArrowNavigation } from '../arrow-navigation';
import { MenuItem as AxMenuItem } from '../menu/menu-item';
import { styleNames } from '../styles';
import { tryFocus } from './utils';
import { isElementDisabled, isElementHidden } from '../arrow-navigation/utils';

import styles from './menubar.module.css';

const MenubarContext = React.createContext<any>({});

const useMenubar = () => useContext(MenubarContext);

function isSubmenu(menuItem: any) {
  return React.Children.toArray(menuItem.props.children).some(
    (child: any) => child.type === AxMenuItem
  );
}

function getDefaultActive() {
  return { submenu: false, text: '' };
}

function Menu({
  children,
  className,
  show: showProp,
  onMouseLeave,
  onKeyDown,
  onHide,
  ...rest
}: any) {
  const [active, setActive] = useState<any>(getDefaultActive());

  const [show, setShow] = useState<boolean>(false);
  const menuRef = useRef<HTMLElement>(null);
  const { hideMenu: hideParentMenu } = useMenubar();

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
      case 'ArrowDown': {
        event.stopPropagation();
        const item = getNextItem();
        const { text, submenu }: any = item.dataset;
        tryFocus(item);
        setActive({ text, submenu });
        break;
      }
      case 'ArrowUp': {
        event.stopPropagation();
        const item = getPreviousItem();
        const { text, submenu }: any = item.dataset;
        tryFocus(item);
        setActive({ text, submenu });
        break;
      }
      case 'ArrowRight': {
        if (active.submenu) {
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

  return (
    <AxMenu
      placement="bottom"
      alignment="start"
      disablePortal
      onHide={onHide}
      onKeyDown={handleKeyDown}
      onMouseLeave={handleMouseLeave}
      tabIndex={1}
      ref={menuRef}
      className={styleNames(className, styles.menu)}
      show={showProp}
      {...rest}
    >
      {React.Children.map(children, child => {
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
          switch (key) {
            case 'Escape':
            case 'ArrowLeft': {
              if (isActiveItem && show) {
                event.stopPropagation();
                setShow(false);
                focusMenu();
              }
              break;
            }
          }
        };

        const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
          const { key } = event;
          switch (key) {
            case 'ArrowRight': {
              onKeyDown && onKeyDown(event); // next/prev menu control
              break;
            }
          }
        };

        const common = {
          ...props,
          as: 'button',
          className: styleNames(styles.item, {
            [styles.active]: isActiveItem,
            [styles.submenu]: submenu,
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
  );
}

function MenuItem({
  text,
  children,
  onMouseLeave,
  onMouseEnter,
  onKeyDown,
  MenuProps,
  ...rest
}: any) {
  const [target, setTarget] = useState(null);
  const selected = useRef('');

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (selected.current !== 'submenu') {
        onMouseLeave();
      }
    },
    [onMouseLeave]
  );

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      selected.current = 'submenu';
    },
    []
  );

  const handleItemMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      selected.current = 'item';
      onMouseEnter(event);
    },
    []
  );

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
        endIcon={BiCaretRightFill}
        onMouseEnter={handleItemMouseEnter}
      />
      <Menu
        target={target}
        placement="end"
        alignment="top"
        onMouseEnter={handleMouseEnter}
        {...MenuProps}
      >
        {children}
      </Menu>
    </div>
  );
}

export function Menubar({ children }: any) {
  const [active, setActive] = useState<string | undefined>(undefined);
  const [show, setShow] = useState<boolean>(false);

  const menus = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child: any) => child.type === AxMenu && child.props.text
      ),
    [children]
  );

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
    [active]
  );

  const getCurrentIndex = useCallback(
    () => menus.findIndex((item: any) => item.props.text === active),
    [menus, active]
  );

  const showNext = useCallback(() => {
    const current = getCurrentIndex();
    const menu: any = menus[(current + 1) % menus.length];
    showMenu(menu.props.text);
  }, [getCurrentIndex]);

  const showPrevious = useCallback(() => {
    const current = getCurrentIndex();
    const menu: any = menus[current === 0 ? menus.length - 1 : current - 1];
    showMenu(menu.props.text);
  }, [getCurrentIndex]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const { key } = event;
      switch (key) {
        case 'ArrowRight': {
          showNext();
          break;
        }
        case 'ArrowLeft': {
          showPrevious();
          break;
        }
        case 'Escape': {
          hideMenu();
          break;
        }
        case 'Tab': {
          event.preventDefault();
          if (event.shiftKey) {
            showPrevious();
          } else {
            showNext();
          }
        }
      }
    },
    [showNext, showPrevious, hideMenu]
  );

  const value = useMemo(() => ({ hideMenu }), [hideMenu]);

  return (
    <MenubarContext.Provider value={value}>
      <ArrowNavigation selector="auto-horizontal">
        <Box d="flex">
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
        </Box>
      </ArrowNavigation>
    </MenubarContext.Provider>
  );
}
