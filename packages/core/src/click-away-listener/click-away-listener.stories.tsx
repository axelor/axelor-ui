import { useState } from 'react';

import { Box } from '../box';
import { Button } from '../button';
import { Popper } from '../popper';
import { ClickAwayListener } from './click-away-listener';

export default {
  component: ClickAwayListener,
  title: 'Core/ClickAwayListener',
};

export const Basic = () => {
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
            <Button mx={2} variant="light">
              Button 1
            </Button>
            <Button mx={2} variant="light">
              Button 2
            </Button>
          </Box>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};
