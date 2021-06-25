/**
 * @title Basic
 */
import React from 'react';
import { Box, Link } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Link href="#" onClick={() => console.log('Link Clicked')}>
        Link
      </Link>
    </Box>
  );
};
