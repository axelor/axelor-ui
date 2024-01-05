import * as React from "react";
import { useCallback, useRef, useState } from "react";

import { BootstrapIcon } from "../../icons/bootstrap-icon";
import { Box } from "../box";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import styled from "../styled";
import { Menu, MenuProps } from "./menu";
import { MenuHeader } from "./menu-header";
import { MenuItem } from "./menu-item";

const config = {
  component: Menu,
  title: "Components/Menu",
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
        <MenuItem onClick={hideMenu}>Option 1</MenuItem>
        <MenuItem onClick={hideMenu}>Option 2</MenuItem>
        <MenuItem onClick={hideMenu}>Option 3</MenuItem>
      </Menu>
    </Box>
  );
};

export const SplitButton = () => {
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
      <ButtonGroup>
        <Button variant="primary">Action</Button>
        <Button
          ref={setTarget}
          onClick={showMenu}
          variant="primary"
          style={{ fontSize: "0.5rem" }}
          p={2}
        >
          <BootstrapIcon icon="caret-down-fill" />
        </Button>
      </ButtonGroup>
      <Menu navigation target={target} show={show} onHide={hideMenu}>
        <MenuItem onClick={hideMenu}>Option 1</MenuItem>
        <MenuItem onClick={hideMenu}>Option 2</MenuItem>
        <MenuItem onClick={hideMenu}>Option 3</MenuItem>
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
      <Menu navigation target={target} show={show} onHide={hideMenu}>
        <MenuHeader>Options</MenuHeader>
        <MenuItem onClick={hideMenu}>Option 1</MenuItem>
        <MenuItem onClick={hideMenu}>Option 2</MenuItem>
        <MenuItem onClick={hideMenu}>Option 3</MenuItem>
      </Menu>
    </Box>
  );
};

const MyButton = styled(Button)(
  ({ m = 2, variant = "primary", textTransform = "capitalize" }) => ({
    m,
    variant,
    textTransform,
  }),
);

export const Positions = () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);
  const [menuProps, setMenuProps] = useState<Partial<MenuProps>>({});
  const refs = useRef<{
    timer?: number;
    clicked: Boolean;
  }>({
    clicked: false,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const placement = e.currentTarget?.textContent || "buttom-start";
    setOpen(true);
    setTargetEl(e.currentTarget);
    setMenuProps({
      target: e.currentTarget,
      placement: placement as MenuProps["placement"],
    });
    clearTimeout(refs.current.timer);
    refs.current.clicked = true;
    refs.current.timer = window.setTimeout(() => {
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
      <Menu
        navigation
        {...menuProps}
        target={targetEl}
        show={open}
        onHide={hide}
      >
        <MenuItem onClick={hide}>Option 1</MenuItem>
        <MenuItem onClick={hide}>Option 2</MenuItem>
        <MenuItem onClick={hide}>Option 3</MenuItem>
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
          style={{ width: "50%" }}
        >
          <MyButton onClick={handleClick}>start-top</MyButton>
          <MyButton onClick={handleClick}>start</MyButton>
          <MyButton onClick={handleClick}>start-bottom</MyButton>
        </Box>
        <Box
          d="flex"
          flexDirection="column"
          alignItems="end"
          style={{ width: "50%" }}
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

export default config;
