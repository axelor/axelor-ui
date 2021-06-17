/**
 * @title Font Weight
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Box as="p" fontWeight="bold">
        Bold text.
      </Box>
      <Box as="p" fontWeight="bolder">
        Bolder weight text (relative to the parent element).
      </Box>
      <Box as="p" fontWeight="normal">
        Normal weight text.
      </Box>
      <Box as="p" fontWeight="light">
        Light weight text.
      </Box>
      <Box as="p" fontWeight="lighter">
        Lighter weight text (relative to the parent element).
      </Box>
      <Box as="p" fontStyle="italic">
        Italic text.
      </Box>
      <Box as="p" fontStyle="normal">
        Text with normal font style
      </Box>
    </Box>
  );
};
