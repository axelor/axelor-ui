import React from 'react';

import { Box } from '../box';
import { Button } from '../button';
import { Fade } from './fade';

export default {
  component: Fade,
  title: 'Animation/Fade',
};

export const Basic = function () {
  const [show, setShow] = React.useState(false);
  const toggle = function () {
    setShow(prev => !prev);
  };

  return (
    <Box>
      <Button variant="primary" onClick={toggle}>
        Toggle
      </Button>
      <Fade in={show}>
        <Box
          mt={2}
          rounded
          bg="secondary"
          style={{ width: 300, height: 100 }}
        ></Box>
      </Fade>
    </Box>
  );
};
