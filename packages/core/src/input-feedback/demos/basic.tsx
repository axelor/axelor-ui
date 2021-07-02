/**
 * @title Basic Usage
 */
import React from 'react';
import { Box, InputFeedback, Input } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Input type="password" />
      <InputFeedback>
        Your password must be 8-20 characters long, contain letters and numbers,
        and must not contain spaces, special characters, or emoji.
      </InputFeedback>
    </Box>
  );
};
