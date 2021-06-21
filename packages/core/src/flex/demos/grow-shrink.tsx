/**
 * @title Grow and Shrink
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

import styles from '@axelor-ui/core/styles/example.module.css';

export default () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" mb={2} className={highlight}>
        <Box p={2} flexGrow={1} className={highlight}>
          Flex grow
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Third flex item
        </Box>
      </Box>
      <Box d="flex" className={highlight}>
        <Box p={2} w={100} className={highlight}>
          Flex Item
        </Box>
        <Box p={2} flexShrink={1} className={highlight}>
          Flex Shrink
        </Box>
      </Box>
    </Box>
  );
};
