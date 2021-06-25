/**
 * @title Colored
 */
import React from 'react';
import { Box, Link } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Link href="#" color="primary">
        Primary link
      </Link>{' '}
      <Link href="#" color="secondary">
        Secondary link
      </Link>{' '}
      <Link href="#" color="success">
        Success link
      </Link>{' '}
      <Link href="#" color="danger">
        Danger link
      </Link>{' '}
      <Link href="#" color="warning">
        Warning link
      </Link>{' '}
      <Link href="#" color="info">
        Info link
      </Link>{' '}
      <Link href="#" color="light">
        Light link
      </Link>{' '}
      <Link href="#" color="dark">
        Dark link
      </Link>
    </Box>
  );
};
