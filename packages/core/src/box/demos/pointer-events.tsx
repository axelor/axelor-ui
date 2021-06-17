/**
 * @title Pointer Events
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Box as="p">
        <Box as="a" href="#" pointerEvents="none" aria-disabled="true">
          This link
        </Box>{' '}
        can not be clicked.
      </Box>
      <Box as="p">
        <Box as="a" href="#" pointerEvents="auto">
          This link
        </Box>{' '}
        can be clicked (this is default behavior).
      </Box>
      <Box as="p" pointerEvents="none">
        <Box as="a" href="#" aria-disabled="true">
          This link
        </Box>{' '}
        can not be clicked because the <code>pointer-events</code> property is
        inherited from its parent. However,{' '}
        <Box as="a" href="#" pointerEvents="auto">
          this link
        </Box>{' '}
        has a <code>pe-auto</code> class and can be clicked.
      </Box>
    </Box>
  );
};
