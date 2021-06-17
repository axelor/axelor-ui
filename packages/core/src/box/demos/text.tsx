/**
 * @title Text
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Box p={1} mb={1} color="primary">
        text-primary
      </Box>
      <Box p={1} mb={1} color="secondary">
        text-secondary
      </Box>
      <Box p={1} mb={1} color="success">
        text-success
      </Box>
      <Box p={1} mb={1} color="danger">
        text-danger
      </Box>
      <Box p={1} mb={1} color="warning" bgColor="dark">
        text-warning
      </Box>
      <Box p={1} mb={1} color="info" bgColor="dark">
        text-info
      </Box>
      <Box p={1} mb={1} color="light" bgColor="dark">
        text-light
      </Box>
      <Box p={1} mb={1} color="dark">
        text-dark
      </Box>
      <Box p={1} mb={1} color="body">
        text-body
      </Box>
      <Box p={1} mb={1} color="muted">
        text-muted
      </Box>
      <Box p={1} mb={1} color="white" bgColor="dark">
        text-white
      </Box>
      <Box p={1} mb={1} color="black-50">
        text-black-50
      </Box>
      <Box p={1} mb={1} color="white-50" bgColor="dark">
        text-white-50
      </Box>
    </Box>
  );
};
