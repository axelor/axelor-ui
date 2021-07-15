/**
 * @title Indeterminate
 */
import React from 'react';
import { CircularProgress, Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <CircularProgress color="primary" indeterminate />
    </Box>
  );
};
