/**
 * @title Disabled
 */
import React from 'react';
import { Box, InputLabel, Input } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <InputLabel disabled>Email</InputLabel>
      <Input type="email" disabled />
    </Box>
  );
};
