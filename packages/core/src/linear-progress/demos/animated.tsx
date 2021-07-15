/**
 * @title Animated
 */
import React from 'react';
import { LinearProgress, Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <LinearProgress value={20} striped animated />
    </Box>
  );
};
