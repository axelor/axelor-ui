/**
 * @title Indeterminate
 */
import React from 'react';
import { LinearProgress, Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <LinearProgress indeterminate thickness={10} />
    </Box>
  );
};
