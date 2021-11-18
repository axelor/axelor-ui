import { useState } from 'react';

import { Box } from '../box';
import { Switch } from './switch';

export default {
  component: Switch,
  title: 'Components/Switch',
};

export const Basic = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      checked={checked}
      onChange={(e: any) => setChecked(e.target.checked)}
    />
  );
};

export const Disabled = () => {
  return <Switch checked={true} disabled />;
};

export const Invalid = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      invalid
      checked={checked}
      onChange={(e: any) => setChecked(e.target.checked)}
    />
  );
};

export const Readonly = () => {
  const [checked, setChecked] = useState(true);

  return (
    <Switch
      readOnly
      checked={checked}
      onChange={(e: any) => setChecked(e.target.checked)}
    />
  );
};

export const Sizes = () => {
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
