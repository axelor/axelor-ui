import { useState } from 'react';

import { Box } from '../box';
import { Button } from '../button';
import { Collapse } from './collapse';

export default {
  component: Collapse,
  title: 'Animation/Collapse',
};

export const Basic = function () {
  const [show, setShow] = useState(false);
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
};

export const Horizontal = function () {
  const [show, setShow] = useState(false);
  const toggle = function () {
    setShow(prev => !prev);
  };

  return (
    <Box>
      <Button variant="primary" onClick={toggle}>
        Toggle
      </Button>
      <Collapse in={show} horizontal>
        <Box
          mt={2}
          rounded
          bg="secondary"
          style={{ width: 300, height: 100 }}
        ></Box>
      </Collapse>
    </Box>
  );
};
