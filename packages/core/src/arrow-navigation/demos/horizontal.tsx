/**
 * @title Horizontal
 */

import React from 'react';

import { Box, Button } from '@axelor-ui/core';
import { ArrowNavigation } from '../arrow-navigation';

function CustomButton(props: any) {
  return <Button m={1} style={{ width: 100 }} variant="primary" {...props} />;
}

export default function () {
  return (
    <ArrowNavigation selector={'auto-horizontal'}>
      <Box d="flex" flexDirection="row">
        <CustomButton>Item 1</CustomButton>
        <CustomButton>Item 2</CustomButton>
        <CustomButton>Item 3</CustomButton>
        <CustomButton style={{ visibility: 'hidden' }}>Item 4</CustomButton>
        <CustomButton>Item 5</CustomButton>
        <CustomButton>Item 6</CustomButton>
        <CustomButton style={{ display: 'none' }}>Item 7</CustomButton>
      </Box>
    </ArrowNavigation>
  );
}
