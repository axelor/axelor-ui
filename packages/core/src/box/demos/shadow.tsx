/**
 * @title Shadows
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Box shadow={false} p={3} mb={5} bgColor="light" rounded={2}>
        No shadow
      </Box>
      <Box shadow="sm" p={3} mb={5} bgColor="body" rounded={2}>
        Small shadow
      </Box>
      <Box shadow p={3} mb={5} bgColor="body" rounded={2}>
        Regular shadow
      </Box>
      <Box shadow="lg" p={3} mb={5} bgColor="body" rounded={2}>
        Larger shadow
      </Box>
    </Box>
  );
};
