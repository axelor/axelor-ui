/**
 * @title Basic
 */
import React from 'react';
import { Divider, Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box p={5}>
      <Box border p={4} bgColor="light" />
      <Divider />
      <Box border p={4} bgColor="light" />
    </Box>
  );
};
