/**
 * @title Flex Direction
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
          Flex item 1
        </Box>
        <Box p={2} className={highlight}>
          Flex item 2
        </Box>
        <Box p={2} className={highlight}>
          Flex item 3
        </Box>
      </Box>
      <Box d="flex" flexDirection="row-reverse" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item 1
        </Box>
        <Box p={2} className={highlight}>
          Flex item 2
        </Box>
        <Box p={2} className={highlight}>
          Flex item 3
        </Box>
      </Box>
      <Box d="flex" flexDirection="column" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item 1
        </Box>
        <Box p={2} className={highlight}>
          Flex item 2
        </Box>
        <Box p={2} className={highlight}>
          Flex item 3
        </Box>
      </Box>
      <Box d="flex" flexDirection="column-reverse" mb={3} className={highlight}>
        <Box p={2} className={highlight}>
          Flex item 1
        </Box>
        <Box p={2} className={highlight}>
          Flex item 2
        </Box>
        <Box p={2} className={highlight}>
          Flex item 3
        </Box>
      </Box>
    </Box>
  );
};
