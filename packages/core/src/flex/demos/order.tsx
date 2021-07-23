/**
 * @title Order
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

import styles from '@axelor-ui/core/styles/example.module.css';

export default () => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example}>
      <Box d="flex" className={highlight}>
        <Box order={3} p={2} className={highlight}>
          First flex item
        </Box>
        <Box order={2} p={2} className={highlight}>
          Second flex item
        </Box>
        <Box order={1} p={2} className={highlight}>
          Third flex item
        </Box>
      </Box>
    </Box>
  );
};
