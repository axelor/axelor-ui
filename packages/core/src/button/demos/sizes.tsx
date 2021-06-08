/**
 * @title Sizes
 */
import React from 'react';
import { Button } from '@axelor-ui/core';

export default () => {
  return (
    <div>
      <Button variant="primary" size="sm">
        Small
      </Button>{' '}
      <Button variant="primary">Normal</Button>{' '}
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  );
};
