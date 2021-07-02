/**
 * @title Invalid
 */
import React from 'react';
import { Box, InputLabel, Input } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <InputLabel invalid>Email</InputLabel>
      <Input type="email" invalid />
    </Box>
  );
};
