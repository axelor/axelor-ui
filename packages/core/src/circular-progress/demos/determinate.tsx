/**
 * @title Determinate
 */
import React from 'react';
import { CircularProgress, Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <CircularProgress color="primary" value={25} />{' '}
      <CircularProgress color="primary" value={50} />{' '}
      <CircularProgress color="primary" value={75} />{' '}
      <CircularProgress color="primary" value={100} />
    </Box>
  );
};
