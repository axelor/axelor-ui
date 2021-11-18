import { useState } from 'react';

import { Button } from './button';

export default {
  component: Button,
  title: 'Components/Button',
};

export const Basic = () => {
  const [text, setText] = useState('Click me...');
  const onClick = () => {
    setText('Clicked!!!');
  };
  return (
    <div>
      <Button variant="primary" onClick={onClick}>
        {text}
      </Button>{' '}
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  );
};

export const Sizes = () => {
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

export const Variants = () => {
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
