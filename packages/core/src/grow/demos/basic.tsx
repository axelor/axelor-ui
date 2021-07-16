/**
 * @title Basic usage
 */

import React from 'react';

import { Box, Button, Grow } from '@axelor-ui/core';

export default function () {
  const [show, setShow] = React.useState(false);
  const toggle = function () {
    setShow(prev => !prev);
  };

  return (
    <Box>
      <Button variant="primary" onClick={toggle}>
        Toggle
      </Button>
      <Grow in={show}>
        <Box
          mt={2}
          shadow
          rounded
          bg="secondary"
          style={{ width: 300, height: 100 }}
        ></Box>
      </Grow>
    </Box>
  );
}
