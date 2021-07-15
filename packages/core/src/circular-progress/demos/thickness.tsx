/**
 * @title Thickness
 */
import React from 'react';
import { CircularProgress, Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <CircularProgress color="primary" thickness={10} value={100} />{' '}
      <CircularProgress color="primary" thickness={1} value={100} />
    </Box>
  );
};
