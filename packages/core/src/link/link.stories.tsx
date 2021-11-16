import React from 'react';

import { Box } from '../box';
import { Link } from '../link';

export default {
  component: Link,
  title: 'Core/Link',
};

export const Basic = () => {
  return (
    <Box>
      <Link m={2} href="#" onClick={() => console.log('Link Clicked')}>
        Link
      </Link>
    </Box>
  );
};

export const Underline = () => {
  return (
    <Box>
      <Link m={2} href="#" underline={true}>
        Link
      </Link>
    </Box>
  );
};

export const Color = () => {
  return (
    <Box>
      <Link m={2} href="#" color="primary">
        Primary link
      </Link>
      <Link m={2} href="#" color="secondary">
        Secondary link
      </Link>
      <Link m={2} href="#" color="success">
        Success link
      </Link>
      <Link m={2} href="#" color="danger">
        Danger link
      </Link>
      <Link m={2} href="#" color="warning">
        Warning link
      </Link>
      <Link m={2} href="#" color="info">
        Info link
      </Link>
      <Link m={2} href="#" color="light" bg="dark">
        Light link
      </Link>
      <Link m={2} href="#" color="dark">
        Dark link
      </Link>
    </Box>
  );
};
