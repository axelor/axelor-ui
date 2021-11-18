import { useCallback, useRef, useState } from 'react';
import * as React from 'react';

import { Box } from '../box';
import { Button } from '../button';
import { Menu } from './menu';
import { MenuHeader } from './menu-header';
import { MenuItem } from './menu-item';

export default {
  component: Menu,
  title: 'Components/Menu',
};

export const Basic = () => {
  const [show, setShow] = React.useState(false);
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  function showMenu() {
    setShow(true);
  }

  function hideMenu() {
    setShow(false);
  }

  return (
    <Box>
      <Button
        ref={setTarget}
        onClick={showMenu}
        bgColor="primary"
        color="light"
      >
        Menu
      </Button>
      <Menu target={target} show={show} onHide={hideMenu}>
        <MenuItem href="#option1" onClick={hideMenu}>
          Option 1
        </MenuItem>
        <MenuItem href="#option2" onClick={hideMenu}>
          Option 2
        </MenuItem>
        <MenuItem href="#option3" onClick={hideMenu}>
          Option 3
        </MenuItem>
      </Menu>
    </Box>
  );
};

export const Header = () => {
  const [show, setShow] = React.useState(false);
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  function showMenu() {
    setShow(true);
  }

  function hideMenu() {
    setShow(false);
  }

  return (
    <Box>
      <Button
        ref={setTarget}
        onClick={showMenu}
        bgColor="primary"
        color="light"
      >
        Menu
      </Button>
      <Menu target={target} show={show} onHide={hideMenu}>
        <MenuHeader>Options</MenuHeader>
        <MenuItem href="#option1" onClick={hideMenu}>
          Option 1
        </MenuItem>
        <MenuItem href="#option2" onClick={hideMenu}>
          Option 2
        </MenuItem>
        <MenuItem href="#option3" onClick={hideMenu}>
          Option 3
        </MenuItem>
      </Menu>
    </Box>
  );
};

const MyButton = ({ children, onClick }: any) => {
  return (
    <Button
      m={2}
      variant="primary"
      textTransform="capitalize"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export const Positions = () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);
  const [menuProps, setMenuProps] = useState<any>({});
  const refs = useRef<{
    timer?: any;
    clicked: Boolean;
  }>({
    clicked: false,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const [placement, alignment] = (
      e.currentTarget?.textContent || 'bottom-start'
    ).split('-');
    setOpen(true);
    setTargetEl(e.currentTarget);
    setMenuProps({
      target: e.currentTarget,
      placement,
      alignment,
    });
    clearTimeout(refs.current.timer);
    refs.current.clicked = true;
    refs.current.timer = setTimeout(() => {
      refs.current.clicked = false;
    }, 10);
  };

  const hide = useCallback(() => {
    if (!refs.current.clicked) {
      setOpen(false);
      setTargetEl(null);
    }
  }, []);

  return (
    <Box style={{ width: 500 }} m="auto">
      <Menu {...menuProps} target={targetEl} show={open} onHide={hide}>
        <MenuItem href="#option1" onClick={hide}>
          Option 1
        </MenuItem>
        <MenuItem href="#option2" onClick={hide}>
          Option 2
        </MenuItem>
        <MenuItem href="#option3" onClick={hide}>
          Option 3
        </MenuItem>
      </Menu>
      <Box d="flex" justifyContent="center">
        <MyButton onClick={handleClick}>top-start</MyButton>
        <MyButton onClick={handleClick}>top</MyButton>
        <MyButton onClick={handleClick}>top-end</MyButton>
      </Box>
      <Box d="flex" justifyContent="center">
        <Box
          d="flex"
          flexDirection="column"
          alignItems="start"
          style={{ width: '50%' }}
        >
          <MyButton onClick={handleClick}>start-top</MyButton>
          <MyButton onClick={handleClick}>start</MyButton>
          <MyButton onClick={handleClick}>start-bottom</MyButton>
        </Box>
        <Box
          d="flex"
          flexDirection="column"
          alignItems="end"
          style={{ width: '50%' }}
        >
          <MyButton onClick={handleClick}>end-top</MyButton>
          <MyButton onClick={handleClick}>end</MyButton>
          <MyButton onClick={handleClick}>end-bottom</MyButton>
        </Box>
      </Box>
      <Box d="flex" justifyContent="center">
        <MyButton onClick={handleClick}>bottom-start</MyButton>
        <MyButton onClick={handleClick}>bottom</MyButton>
        <MyButton onClick={handleClick}>bottom-end</MyButton>
      </Box>
    </Box>
  );
};
