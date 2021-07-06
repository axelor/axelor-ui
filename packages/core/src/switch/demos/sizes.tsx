/**
 * @title Sizes
 */
import React, { useState } from 'react';
import { Switch, Box } from '@axelor-ui/core';

export default () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: any) => setChecked(e.target.checked);

  return (
    <Box>
      <Switch checked={checked} onChange={handleChange} size="sm" />
      <Switch checked={checked} onChange={handleChange} />
      <Switch checked={checked} onChange={handleChange} size="lg" />
    </Box>
  );
};
