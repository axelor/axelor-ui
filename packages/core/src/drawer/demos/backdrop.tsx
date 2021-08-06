/**
 * @title Backdrop
 */
import React from 'react';
import { Button, Box, Drawer } from '@axelor-ui/core';

export default () => {
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
