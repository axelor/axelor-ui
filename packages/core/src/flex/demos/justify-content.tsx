/**
 * @title Justify Content
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

import styles from '@axelor-ui/core/styles/example.module.css';

export default () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" justifyContent="start" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="end" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="center" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="space-between" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="space-around" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" justifyContent="space-evenly" className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
    </Box>
  );
};
