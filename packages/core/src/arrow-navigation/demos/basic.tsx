/**
 * @title Basic usage
 */

import React from 'react';

import { Box, Button } from '@axelor-ui/core';
import { ArrowNavigation } from '../arrow-navigation';

function CustomButton(props: any) {
  return <Button m={1} style={{ width: 50 }} variant="primary" {...props} />;
}

export default function () {
  const boxRef = React.useRef<HTMLElement | null>(null);

  const selector: any = React.useCallback(() => {
    const box: HTMLElement | null = boxRef.current;
    if (box) {
      return [
        box.querySelectorAll('div:nth-child(1) > button'),
        box.querySelectorAll('div:nth-child(2) > button'),
        box.querySelectorAll('div:nth-child(3) > button'),
      ];
    }
    return [];
  }, [boxRef]);

  return (
    <ArrowNavigation selector={selector}>
      <Box ref={boxRef as any} d="flex" flexDirection="column">
        <Box d="flex">
          <CustomButton>1</CustomButton>
          <CustomButton>2</CustomButton>
          <CustomButton>3</CustomButton>
        </Box>
        <Box d="flex">
          <CustomButton>4</CustomButton>
          <CustomButton>5</CustomButton>
          <CustomButton disabled>6</CustomButton>
          <CustomButton>C</CustomButton>
          <CustomButton>DEL</CustomButton>
        </Box>
        <Box d="flex">
          <CustomButton>7</CustomButton>
          <CustomButton>8</CustomButton>
          <CustomButton>9</CustomButton>
          <CustomButton>=</CustomButton>
        </Box>
      </Box>
    </ArrowNavigation>
  );
}
