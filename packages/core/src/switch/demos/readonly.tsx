/**
 * @title Readonly
 */
import React, { useState } from 'react';
import { Switch } from '@axelor-ui/core';

export default () => {
  const [checked, setChecked] = useState(true);

  return (
    <Switch
      readOnly
      checked={checked}
      onChange={(e: any) => setChecked(e.target.checked)}
    />
  );
};
