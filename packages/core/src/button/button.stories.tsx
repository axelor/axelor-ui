import React from 'react';

import { Button } from './button';

export default {
  component: Button,
  title: 'Core/Button',
};

export const Basic = () => <Button variant="primary">Button</Button>;

export const Variants = () => {
  return (
    <div>
      <Button me={1} variant="primary">
        Primary
      </Button>
      <Button me={1} variant="secondary">
        Secondary
      </Button>
      <Button me={1} variant="success">
        Success
      </Button>
    </div>
  );
};
