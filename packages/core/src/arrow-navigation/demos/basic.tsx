/**
 * @title Basic usage
 */

import React from 'react';

import { Box, Button } from '@axelor-ui/core';
import { ArrowNavigation } from '../arrow-navigation';

function CustomButton(props: any) {
  return (
    <Button
      m={1}
      variant="primary"
      {...props}
      style={{ width: 50, ...props.style }}
    />
  );
}

export default function () {
  const [box, setBox] = React.useState<HTMLElement | null>(null);

  const selector: any = React.useCallback(() => {
    if (box) {
      return [
        box.querySelectorAll('div:nth-child(1) > button'),
        box.querySelectorAll('div:nth-child(2) > button'),
        box.querySelectorAll('div:nth-child(3) > button'),
        box.querySelectorAll('div:nth-child(4) > button'),
      ];
    }
    return [];
  }, [box]);

  return (
    <ArrowNavigation selector={selector}>
      <Box ref={setBox} d="flex" flexDirection="column">
        <Box d="flex">
          <CustomButton>1</CustomButton>
          <CustomButton>2</CustomButton>
          <CustomButton>3</CustomButton>
          <CustomButton>.</CustomButton>
        </Box>
        <Box d="flex">
          <CustomButton>4</CustomButton>
          <CustomButton>5</CustomButton>
          <CustomButton>6</CustomButton>
          <CustomButton disabled>C</CustomButton>
          <CustomButton>DEL</CustomButton>
        </Box>
        <Box d="flex">
          <CustomButton>7</CustomButton>
          <CustomButton>8</CustomButton>
          <CustomButton>9</CustomButton>
          <CustomButton>=</CustomButton>
          <CustomButton>00</CustomButton>
        </Box>
        <Box d="flex">
          <CustomButton>0</CustomButton>
          <CustomButton style={{ visibility: 'hidden' }}>0</CustomButton>
          <CustomButton style={{ visibility: 'hidden' }}>0</CustomButton>
          <CustomButton>(</CustomButton>
          <CustomButton>)</CustomButton>
        </Box>
      </Box>
    </ArrowNavigation>
  );
}
