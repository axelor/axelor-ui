import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Box } from '../box';
import { Menu as AxMenu } from '../menu/menu';
import { ArrowNavigation } from '../arrow-navigation';
import { MenuItem as AxMenuItem } from '../menu/menu-item';
import { styleNames } from '../styles';

import styles from './menubar.module.css';

const MenubarContext = React.createContext<any>({});

const useMenubar = () => useContext(MenubarContext);

function isSubmenu(menuItem: any) {
  return React.Children.toArray(menuItem.props.children).some(
    (child: any) => child.type === AxMenuItem
  );
}

function Menu({ children, onMouseLeave, onHide, ...rest }: any) {
  const [active, setActive] = useState<any>({
    submenu: false,
    text: '',
  });

  const [show, setShow] = useState<boolean>(false);
  const { hideMenu: hideParentMenu } = useMenubar();

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    onMouseLeave && onMouseLeave(event);
    if ((active.text && !active.submenu) || (!show && active.text)) {
      setActive({ submenu: false, text: '' });
    }
  };

  useEffect(() => {
    if (!rest.show) {
      setActive({ submenu: false, text: '' });
      setShow(false);
    }
  }, [rest.show]);

  return (
    <AxMenu
      placement="bottom"
      alignment="start"
      disablePortal
      onMouseLeave={handleMouseLeave}
      onHide={onHide}
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

        const common = {
          ...props,
          className: styleNames(styles.menuItem, {
            [styles.active]: isActiveItem,
            [styles.submenu]: submenu,
          }),
          onClick: handleClick,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
        };

        return submenu ? (
          <MenuItem {...common} MenuProps={{ show: show && isActiveItem }} />
        ) : (
          <AxMenuItem {...common} />
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
    <div tabIndex={-1} onMouseLeave={handleMouseLeave}>
      <AxMenuItem
        {...rest}
        as="button"
        text={text}
        ref={setTarget}
        endIcon={'caret-right-fill'}
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

  const hideMenu = useCallback(() => {
    setActive(undefined);
    setShow(false);
  }, []);

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
              hideMenu();
              onHide && onHide(event);
            };

            return (
              <Menu
                {...menu.props}
                key={text}
                show={show && active === text}
                onShow={handleShow}
                onHide={handleHide}
              />
            );
          })}
        </Box>
      </ArrowNavigation>
    </MenubarContext.Provider>
  );
}
