/**
 * @title Fill
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

import styles from '@axelor-ui/core/styles/example.module.css';

export default () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box d="flex" className={example}>
      <Box p={2} flexFill className={highlight}>
        Flex item with a lot of content
      </Box>
      <Box p={2} flexFill className={highlight}>
        Flex item
      </Box>
      <Box p={2} flexFill className={highlight}>
        Flex item
      </Box>
    </Box>
  );
};
