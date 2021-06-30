/**
 * @title Basic Usage
 */
import React, { useState } from 'react';
import { Input } from '@axelor-ui/core';

export default () => {
  const [value, setValue] = useState('');
  
  return (
    <Input value={value} onChange={(e: any) => setValue(e.target.value)} />
  );
};
