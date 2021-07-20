/**
 * @title Placement
 */

import React, { useState } from 'react';

import { Button, Box, Popper } from '@axelor-ui/core';

const MyButton = ({ children, onClick }: any) => {
  return (
    <Button
      m={2}
      variant="primary"
      textTransform="capitalize"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default () => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);
  const [placement, setPlacement] = useState<any>();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newPlacement = e.currentTarget?.textContent || 'bottom';
    setTargetEl(e.currentTarget);
    setPlacement(newPlacement);
    setOpen(prev => placement !== newPlacement || !prev);
  };

  return (
    <Box style={{ width: 500 }} m="auto">
      <Popper
        target={targetEl}
        open={open}
        placement={placement}
        offset={[0, 4]}
        arrow
        shadow
      >
        <Box p={3} bg="secondary" color="light" rounded>
          The content of the Popper.
        </Box>
      </Popper>
      <Box d="flex" justifyContent="center">
        <MyButton onClick={handleClick}>top-start</MyButton>
        <MyButton onClick={handleClick}>top</MyButton>
        <MyButton onClick={handleClick}>top-end</MyButton>
      </Box>
      <Box d="flex" justifyContent="center">
        <Box
          d="flex"
          flexDirection="column"
          alignItems="start"
          style={{ width: '50%' }}
        >
          <MyButton onClick={handleClick}>start-top</MyButton>
          <MyButton onClick={handleClick}>start</MyButton>
          <MyButton onClick={handleClick}>start-bottom</MyButton>
        </Box>
        <Box
          d="flex"
          flexDirection="column"
          alignItems="end"
          style={{ width: '50%' }}
        >
          <MyButton onClick={handleClick}>end-top</MyButton>
          <MyButton onClick={handleClick}>end</MyButton>
          <MyButton onClick={handleClick}>end-bottom</MyButton>
        </Box>
      </Box>
      <Box d="flex" justifyContent="center">
        <MyButton onClick={handleClick}>bottom-start</MyButton>
        <MyButton onClick={handleClick}>bottom</MyButton>
        <MyButton onClick={handleClick}>bottom-end</MyButton>
      </Box>
    </Box>
  );
};
