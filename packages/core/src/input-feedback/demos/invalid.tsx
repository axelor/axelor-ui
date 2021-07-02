/**
 * @title Invalid
 */
import React from 'react';
import { Box, InputFeedback, Input } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Input type="password" invalid defaultValue="axelor" />
      <InputFeedback invalid>
        Your password must contain a special character
      </InputFeedback>
    </Box>
  );
};
