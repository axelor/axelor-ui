/**
 * @title Positions
 */
import React from 'react';
import {
  Input,
  InputLabel,
  Button,
  Box,
  Drawer,
  ClickAwayListener,
} from '@axelor-ui/core';

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

export default () => {
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
