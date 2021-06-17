/**
 * @title Borders
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box d="flex">
      <Box float="start" p={5} m={2} border></Box>
      <Box float="start" p={5} m={2} border rounded={2} borderWidth={2}></Box>
      <Box float="start" p={5} m={2} border borderColor="primary"></Box>
      <Box float="start" p={5} m={2} borderTop bgColor="light"></Box>
      <Box float="start" p={5} m={2} borderEnd bgColor="light"></Box>
      <Box float="start" p={5} m={2} borderBottom bgColor="light"></Box>
      <Box float="start" p={5} m={2} borderStart bgColor="light"></Box>
    </Box>
  );
};
