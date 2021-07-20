/**
 * @title Transition
 */

import React, { useState } from 'react';

import { Button, Box, Popper, Grow } from '@axelor-ui/core';

export default () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);

  const toggle = () => setOpen(v => !v);

  return (
    <div>
      <Button variant="primary" ref={setTargetEl} onClick={toggle}>
        Button
      </Button>
      <Popper open={open} target={targetEl} transition={Grow} offset={[0, 4]}>
        <Box p={2} bg="secondary" color="light" border rounded shadow>
          The content of the Popper.
        </Box>
      </Popper>
    </div>
  );
};
