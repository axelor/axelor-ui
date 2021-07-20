/**
 * @title Basic usage
 */

import React from 'react';

import { Box, Button, Collapse } from '@axelor-ui/core';

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
      <Collapse in={show}>
        <Box
          mt={2}
          rounded
          bg="secondary"
          style={{ width: 300, height: 100 }}
        ></Box>
      </Collapse>
    </Box>
  );
}