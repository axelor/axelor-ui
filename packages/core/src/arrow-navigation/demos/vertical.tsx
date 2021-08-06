/**
 * @title Vertical
 */

import React from 'react';

import { Box, Button } from '@axelor-ui/core';
import { ArrowNavigation } from '../arrow-navigation';

function CustomButton(props: any) {
  return <Button m={1} style={{ width: 100 }} variant="primary" {...props} />;
}

export default function () {
  return (
    <ArrowNavigation selector={'auto-vertical'}>
      <Box d="flex" flexDirection="column">
        <CustomButton>Item 1</CustomButton>
        <CustomButton>Item 2</CustomButton>
        <CustomButton disabled>Item 3</CustomButton>
        <CustomButton>Item 4</CustomButton>
        <CustomButton>Item 5</CustomButton>
        <CustomButton>Item 6</CustomButton>
      </Box>
    </ArrowNavigation>
  );
}
