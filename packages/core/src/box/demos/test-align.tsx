/**
 * @title Text Alignment
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Box as="p" textAlign="start">
        Start aligned text on all viewport sizes.
      </Box>
      <Box as="p" textAlign="center">
        Center aligned text on all viewport sizes.
      </Box>
      <Box as="p" textAlign="end">
        End aligned text on all viewport sizes.
      </Box>

      <Box as="p" sm={{ textAlign: 'start' }}>
        Start aligned text on viewports sized SM (small) or wider.
      </Box>
      <Box as="p" md={{ textAlign: 'start' }}>
        Start aligned text on viewports sized MD (medium) or wider.
      </Box>
      <Box as="p" lg={{ textAlign: 'start' }}>
        Start aligned text on viewports sized LG (large) or wider.
      </Box>
      <Box as="p" xl={{ textAlign: 'start' }}>
        Start aligned text on viewports sized XL (extra-large) or wider.
      </Box>
    </Box>
  );
};
