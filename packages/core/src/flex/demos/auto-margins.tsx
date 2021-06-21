/**
 * @title Auto Margins
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

import styles from '@axelor-ui/core/styles/example.module.css';

export default () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" mb={3} className={highlight}>
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

      <Box d="flex" mb={3} className={highlight}>
        <Box me="auto" p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>

      <Box d="flex" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box ms="auto" p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
    </Box>
  );
};
