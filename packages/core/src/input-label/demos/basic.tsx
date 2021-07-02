/**
 * @title Basic Usage
 */
import React from 'react';
import { Box, InputLabel, Input } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <InputLabel>Email</InputLabel>
      <Input type="email" />
    </Box>
  );
};
