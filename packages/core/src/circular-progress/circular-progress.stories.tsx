import React from 'react';

import { Box } from '../box';
import { Button } from '../button';
import { CircularProgress } from './circular-progress';

export default {
  component: CircularProgress,
  title: 'Components/CircularProgress',
};

export const Composition = () => {
  return (
    <Box>
      <Button variant="primary">
        Loading <CircularProgress size={10} indeterminate />
      </Button>{' '}
      <Button disabled variant="primary">
        Loading <CircularProgress size={10} indeterminate />
      </Button>
    </Box>
  );
};

export const Determinate = () => {
  return (
    <Box>
      <CircularProgress color="primary" value={25} />{' '}
      <CircularProgress color="primary" value={50} />{' '}
      <CircularProgress color="primary" value={75} />{' '}
      <CircularProgress color="primary" value={100} />
    </Box>
  );
};

export const Indeterminate = () => {
  return (
    <Box>
      <CircularProgress color="primary" indeterminate />
    </Box>
  );
};

export const Sizes = () => {
  return (
    <Box>
      <CircularProgress color="primary" size={70} value={25} />{' '}
      <CircularProgress color="primary" size={70} value={50} />{' '}
      <CircularProgress color="primary" size={70} value={75} />{' '}
      <CircularProgress color="primary" size={70} value={100} />{' '}
      <CircularProgress color="primary" size={70} indeterminate />
    </Box>
  );
};

export const Thickness = () => {
  return (
    <Box>
      <CircularProgress color="primary" thickness={10} value={100} />{' '}
      <CircularProgress color="primary" thickness={1} value={100} />
    </Box>
  );
};
