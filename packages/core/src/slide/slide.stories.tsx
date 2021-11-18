import { useState } from 'react';

import { Box } from '../box';
import { Button } from '../button';
import { Input } from '../input';
import { InputLabel } from '../input-label';

import { Slide } from './slide';

export default {
  component: Slide,
  title: 'Animation/Slide',
};

export const Basic = function () {
  const [show, setShow] = useState(false);
  const [direction, setDirection] = useState<any>('start');

  const toggle = function () {
    setShow(prev => !prev);
  };

  return (
    <Box>
      <Box d="flex" alignItems="center">
        <Button variant="primary" onClick={toggle}>
          Toggle
        </Button>
        <InputLabel m={0} ms={2}>
          <Input
            me={1}
            type="checkbox"
            value="start"
            checked={direction === 'start'}
            onChange={e => setDirection('start')}
          />
          Start
        </InputLabel>
        <InputLabel m={0} ms={2}>
          <Input
            me={1}
            type="checkbox"
            value="end"
            checked={direction === 'end'}
            onChange={e => setDirection('end')}
          />
          End
        </InputLabel>
        <InputLabel m={0} ms={2}>
          <Input
            me={1}
            type="checkbox"
            value="up"
            checked={direction === 'up'}
            onChange={e => setDirection('up')}
          />
          Up
        </InputLabel>
        <InputLabel m={0} ms={2}>
          <Input
            me={1}
            type="checkbox"
            value="down"
            checked={direction === 'down'}
            onChange={e => setDirection('down')}
          />
          Down
        </InputLabel>
      </Box>
      <Slide in={show} direction={direction}>
        <Box
          mt={2}
          rounded
          bg="secondary"
          style={{ width: 300, height: 100 }}
        ></Box>
      </Slide>
    </Box>
  );
};
