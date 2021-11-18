import { useState } from 'react';
import * as React from 'react';

import { Box } from '../box';
import { Button } from '../button';
import { Input } from '../input';
import { InputLabel } from '../input-label';
import { ClickAwayListener } from '../click-away-listener';
import { Drawer } from './drawer';

export default {
  component: Drawer,
  title: 'Components/Drawer',
};

export const Backdrop = () => {
  const [show, setShow] = React.useState<boolean>(false);

  const showDrawer = () => {
    setShow(true);
  };

  const hideDrawer = React.useCallback(() => {
    setShow(false);
  }, []);

  return (
    <div>
      <Button
        size="sm"
        variant="primary"
        onClick={() => (show ? hideDrawer() : showDrawer())}
      >
        Show drawer
      </Button>
      <Drawer
        d="flex"
        bgColor="light"
        placement="start"
        open={show}
        onClose={hideDrawer}
        backdrop
      >
        <Box
          d="flex"
          border
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          style={{ width: 320 }}
        >
          I am drawer
        </Box>
      </Drawer>
    </div>
  );
};

export const Basic = () => {
  const [show, setShow] = React.useState<boolean>(false);

  const showDrawer = () => {
    setShow(true);
  };

  const hideDrawer = React.useCallback(() => {
    setShow(false);
  }, []);

  return (
    <div>
      <Button size="sm" variant="primary" onClick={() => showDrawer()}>
        Show drawer
      </Button>
      <Drawer
        d="flex"
        bgColor="light"
        placement="start"
        open={show}
        onClose={hideDrawer}
      >
        <ClickAwayListener onClickAway={hideDrawer}>
          <Box
            d="flex"
            border
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            style={{ width: 320 }}
          >
            I am drawer
          </Box>
        </ClickAwayListener>
      </Drawer>
    </div>
  );
};

function DrawerDemo({ placement, clickAway }: any) {
  const [show, setShow] = React.useState<boolean>(false);

  const showDrawer = () => {
    setShow(true);
  };

  const hideDrawer = React.useCallback(() => {
    setShow(false);
  }, []);

  const render = (children: React.ReactElement) => {
    if (clickAway) {
      return (
        <ClickAwayListener onClickAway={hideDrawer}>
          {children}
        </ClickAwayListener>
      );
    }
    return children;
  };

  return (
    <Box d="inline" mx={2}>
      <Button
        size="sm"
        variant="primary"
        onClick={() => (show ? hideDrawer() : showDrawer())}
      >
        {placement}
      </Button>
      <Drawer
        d="flex"
        bgColor="light"
        placement={placement}
        open={show}
        onClose={hideDrawer}
      >
        {render(
          <Box
            d="flex"
            border
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            style={{ width: 320 }}
          >
            I am drawer
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

export const Positions = () => {
  const [clickAway, setClickAway] = React.useState(true);
  return (
    <Box>
      <InputLabel m={0} ms={2} mb={2}>
        <Input
          type="checkbox"
          checked={clickAway}
          onChange={() => setClickAway(clickAway => !clickAway)}
        />{' '}
        Close on click away
      </InputLabel>
      <br />
      {['start', 'top', 'end', 'bottom'].map(placement => (
        <DrawerDemo {...{ key: placement, placement, clickAway }} />
      ))}
    </Box>
  );
};

export const Shadow = () => {
  const [show, setShow] = React.useState<boolean>(false);

  const showDrawer = () => {
    setShow(true);
  };

  const hideDrawer = React.useCallback(() => {
    setShow(false);
  }, []);

  return (
    <div>
      <Button size="sm" variant="primary" onClick={() => showDrawer()}>
        Show drawer
      </Button>
      <Drawer
        d="flex"
        bgColor="light"
        placement="start"
        open={show}
        onClose={hideDrawer}
        shadow
      >
        <ClickAwayListener onClickAway={hideDrawer}>
          <Box
            d="flex"
            border
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            style={{ width: 320 }}
          >
            I am drawer
          </Box>
        </ClickAwayListener>
      </Drawer>
    </div>
  );
};
