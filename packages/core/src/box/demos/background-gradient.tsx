/**
 * @title Background Gradient
 */
import React from 'react';
import { Box } from '@axelor-ui/core';

const colors: any = {
  primary: 'white',
  secondary: 'white',
  success: 'white',
  danger: 'white',
  warning: 'dark',
  info: 'dark',
  light: 'dark',
  dark: 'white',
};

export default () => {
  return (
    <Box>
      {(Object.keys(colors) as Array<any>).map(c => (
        <Box
          key={c}
          p={3}
          mb={2}
          bgColor={c}
          color={colors[c]}
          bgGradient
        >
          {c} gradient
        </Box>
      ))}
    </Box>
  );
};
