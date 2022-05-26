import { useRef, useState } from 'react';

import { Box } from '../box';
import { Button } from '../button';
import { Portal } from './portal';

const config = {
  component: Portal,
  title: 'Core/Portal',
};

export const Basic = () => {
  const [show, setShow] = useState(false);
  const container = useRef(null);

  const toggle = () => {
    setShow(prev => !prev);
  };

  return (
    <Box>
      <Button variant="primary" onClick={toggle}>
        Toggle
      </Button>
      <Box mt={2} p={2} border>
        It looks like I will render here...
        {show && (
          <Portal container={container.current}>
            <Box
              p={2}
              bg="secondary"
              color="light"
              border
              rounded
              style={{ width: 200, height: 200 }}
            >
              But I actually render here!
            </Box>
          </Portal>
        )}
      </Box>
      <Box mt={2} p={2} ref={container} border></Box>
    </Box>
  );
};

export default config;
