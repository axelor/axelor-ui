/**
 * @title Overflow
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box display="flex">
      <Box
        overflow="auto"
        p={3}
        mb={3}
        md={{
          mb: 0,
          me: 3,
        }}
        bgColor="light"
        style={{ maxWidth: 260, maxHeight: 100 }}
      >
        This is an example of using <code>.overflow-auto</code> on an element
        with set width and height dimensions. By design, this content will
        vertically scroll.
      </Box>
      <Box
        overflow="hidden"
        p={3}
        mb={3}
        md={{
          mb: 0,
          me: 3,
        }}
        bgColor="light"
        style={{ maxWidth: 260, maxHeight: 100 }}
      >
        This is an example of using <code>.overflow-hidden</code> on an element
        with set width and height dimensions.
      </Box>
      <Box
        overflow="visible"
        p={3}
        mb={3}
        md={{
          mb: 0,
          me: 3,
        }}
        bgColor="light"
        style={{ maxWidth: 260, maxHeight: 100 }}
      >
        This is an example of using <code>.overflow-visible</code> on an element
        with set width and height dimensions.
      </Box>
      <Box
        overflow="scroll"
        p={3}
        bgColor="light"
        style={{ maxWidth: 260, maxHeight: 100 }}
      >
        This is an example of using <code>.overflow-scroll</code> on an element
        with set width and height dimensions.
      </Box>
    </Box>
  );
};
