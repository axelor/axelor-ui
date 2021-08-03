/**
 * @title With usePopperTrigger
 */

import React, { useState } from 'react';

import {
  InputLabel,
  Input,
  Button,
  Box,
  Popper,
  ClickAwayListener,
  usePopperTrigger,
} from '@axelor-ui/core';

function Example({ event, interactive }: any) {
  const { open, targetEl, setTargetEl, setContentEl, onClickAway } =
    usePopperTrigger({
      trigger: event,
      interactive,
    });

  return (
    <Box ms={1}>
      <Button textTransform="capitalize" variant="primary" ref={setTargetEl}>
        {event}
      </Button>
      <ClickAwayListener onClickAway={onClickAway}>
        <Popper open={open} target={targetEl} offset={[0, 4]}>
          <Box p={2} ref={setContentEl} style={{ width: 320 }}>
            <Box as="h4">Personal Information</Box>
            <Input mt={1} placeholder="First Name" />
            <Input mt={1} placeholder="Last Name" />
            <Button mt={1} variant="primary">
              Save
            </Button>
          </Box>
        </Popper>
      </ClickAwayListener>
    </Box>
  );
}

export default () => {
  const [interactive, setInteractive] = useState(false);

  return (
    <Box d="flex" alignItems="center">
      <Example event="click" interactive={interactive} />
      <Example event="hover" interactive={interactive} />
      <Example event="focus" interactive={interactive} />
      <InputLabel m={0} ms={2}>
        <Input
          type="checkbox"
          checked={interactive}
          onClick={() => setInteractive(checked => !checked)}
        />{' '}
        Interactive
      </InputLabel>
    </Box>
  );
};
