/**
 * @title Basic usage
 */

import React, { useState } from 'react';
import { Button, Box, Popper, ClickAwayListener } from '@axelor-ui/core';

export default () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);

  const toggle = () => setOpen(v => !v);

  return (
    <div>
      <Button variant="primary" ref={setTargetEl} onClick={toggle}>
        Show popper
      </Button>
      <Popper open={open} target={targetEl} offset={[0, 4]}>
        <ClickAwayListener onClickAway={toggle}>
          <Box p={2} bg="secondary" color="light" border rounded shadow>
            <p>Sample Buttons</p>
            <p>Click outside to close the popper</p>
            <Button mx={2} variant="light">Button 1</Button>
            <Button mx={2} variant="light">Button 2</Button>
          </Box>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};
