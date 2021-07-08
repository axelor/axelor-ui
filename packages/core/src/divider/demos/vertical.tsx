/**
 * @title Vertical
 */
import React from 'react';
import { Divider, Box } from '@axelor-ui/core';

export default () => {
  return (
    <div>
      <Box d={"flex"} p={5} style={{ height: 200 }}>
        <Box border p={4} bgColor="light" />
        <Divider vertical />
        <Box border p={4} bgColor="light" />
      </Box>
    </div>
  );
};
