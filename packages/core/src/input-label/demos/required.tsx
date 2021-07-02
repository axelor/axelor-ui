/**
 * @title Required
 */
import React from 'react';
import { Box, InputLabel, Input } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <InputLabel required>Email</InputLabel>
      <Input type="email" required />
    </Box>
  );
};
