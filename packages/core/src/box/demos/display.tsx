/**
 * @title Display
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Box mb={2}>
        <Box d="inline" p={1} bgColor="primary" color="white">
          inline
        </Box>
        <Box d="inline" p={1} bgColor="dark" color="white">
          inline
        </Box>
      </Box>
      <Box mb={2}>
        <Box d="block" p={1} bgColor="primary" color="white">
          block
        </Box>
        <Box d="block" p={1} bgColor="dark" color="white">
          block
        </Box>
      </Box>
    </Box>
  );
};
