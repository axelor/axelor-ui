/**
 * @title Basic usage
 */
import React, { useState } from 'react';
import { Button } from '@axelor-ui/core';

export default () => {
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
