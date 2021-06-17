/**
 * @title Font Size
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Box as="p" fontSize={1}>
        fontSize={`{1}`} text
      </Box>
      <Box as="p" fontSize={2}>
        fontSize={`{2}`} text
      </Box>
      <Box as="p" fontSize={3}>
        fontSize={`{3}`} text
      </Box>
      <Box as="p" fontSize={4}>
        fontSize={`{4}`} text
      </Box>
      <Box as="p" fontSize={5}>
        fontSize={`{5}`} text
      </Box>
      <Box as="p" fontSize={6}>
        fontSize={`{6}`} text
      </Box>
    </Box>
  );
};
