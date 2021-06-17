/**
 * @title Float
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Box float="start">Float start on all viewport sizes</Box>
      <br />
      <Box float="end">Float end on all viewport sizes</Box>
      <br />
      <Box float="none">Don't float on all viewport sizes</Box>
    </Box>
  );
};
