/**
 * @title Align Self
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

import styles from '@axelor-ui/core/styles/example.module.css';

export default () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" mb={3} className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="start" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" mb={3} className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="end" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" mb={3} className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="center" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" mb={3} className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="baseline" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
      <Box d="flex" className={highlight} style={{ height: 100 }}>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box alignSelf="stretch" p={2} className={highlight}>
          Aligned flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
      </Box>
    </Box>
  );
};
