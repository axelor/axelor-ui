/**
 * @title Link Text
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="primary">
        link-primary
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="secondary">
        link-secondary
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="success">
        link-success
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="danger">
        link-danger
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="warning">
        link-warning
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="info">
        link-info
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="light">
        link-light
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="dark">
        link-dark
      </Box>
    </Box>
  );
};
