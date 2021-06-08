/**
 * @title Vertical
 */
import React from 'react';
import { ButtonGroup, Button } from '@axelor-ui/core';

export default () => {
  return (
    <ButtonGroup vertical>
      <Button variant="primary">One</Button>
      <Button variant="primary">Two</Button>
      <Button variant="primary">Three</Button>
    </ButtonGroup>
  );
};
