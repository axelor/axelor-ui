/**
 * @title Align Items
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

import styles from '@axelor-ui/core/styles/example.module.css';

export default () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="start"
        mb={3}
        className={highlight}
      >
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
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="end"
        mb={3}
        className={highlight}
      >
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
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="center"
        mb={3}
        className={highlight}
      >
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
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="baseline"
        mb={3}
        className={highlight}
      >
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
      <Box
        d="flex"
        style={{ height: 100 }}
        alignItems="stretch"
        className={highlight}
      >
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
