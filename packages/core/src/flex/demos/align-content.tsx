/**
 * @title Align Content
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

import styles from '@axelor-ui/core/styles/example.module.css';

const ExampleBox = ({ alignContent, mb = 3 }: any) => {
  const example = styles.example;
  const highlight = styles.highlight;
  return (
    <Box className={example} mb={mb}>
      <Box
        d="flex"
        alignContent={alignContent}
        flexWrap
        className={highlight}
        style={{ height: 200, width: 800 }}
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
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
        <Box p={2} className={highlight}>
          Flex item
        </Box>
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

export default () => {
  return (
    <Box>
      <ExampleBox alignContent="start" />
      <ExampleBox alignContent="end" />
      <ExampleBox alignContent="center" />
      <ExampleBox alignContent="space-between" />
      <ExampleBox alignContent="space-around" mb={0} />
    </Box>
  );
};
