/**
 * @title Variants
 * @sort 2
 */
import React from 'react';
import { Button } from '@axelor-ui/core';

export default () => {
  return (
    <div>
      <Button variant="primary">Primary</Button>{' '}
      <Button variant="secondary">Secondary</Button>{' '}
      <Button variant="success">Success</Button>{' '}
      <Button variant="danger">Danger</Button>{' '}
      <Button variant="warning">Warning</Button>{' '}
      <Button variant="info">Info</Button> <Button variant="dark">Dark</Button>{' '}
      <Button variant="light">Light</Button>{' '}
      <Button variant="link" as="a" href="#">
        Link
      </Button>
    </div>
  );
};
