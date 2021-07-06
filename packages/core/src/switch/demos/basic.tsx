/**
 * @title Basic Usage
 */
import React, { useState } from 'react';
import { Switch } from '@axelor-ui/core';

export default () => {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      checked={checked}
      onChange={(e: any) => setChecked(e.target.checked)}
    />
  );
};
