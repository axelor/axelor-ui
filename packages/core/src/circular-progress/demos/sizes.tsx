/**
 * @title Sizes
 */
import React from 'react';
import { CircularProgress, Box } from '@axelor-ui/core';

export default () => {
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
