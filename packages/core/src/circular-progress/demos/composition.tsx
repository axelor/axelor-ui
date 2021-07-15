/**
 * @title Composition
 */
import React from 'react';
import { CircularProgress, Box, Button } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Button variant="primary">
        Loading <CircularProgress size={10} indeterminate />
      </Button>{' '}
      <Button disabled variant="primary">
        Loading <CircularProgress size={10} indeterminate />
      </Button>
    </Box>
  );
};
