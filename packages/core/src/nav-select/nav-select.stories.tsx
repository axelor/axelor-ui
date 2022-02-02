import React from 'react';
import { Box } from '../box';
import { TNavSelectItem, NavSelect } from './nav-select';

export default {
  component: NavSelect,
  title: 'Components/NavSelect',
};

const items = [
  { title: 'Draft', value: 'draft' },
  { title: 'Open', value: 'open' },
  { title: 'Closed', value: 'closed' },
  { title: 'Cancelled', value: 'cancelled' },
];

export const Basic = () => {
  const [value, setValue] = React.useState<TNavSelectItem | null>(null);
  return (
    <Box style={{ marginLeft: 400, minWidth: 100 }}>
      <NavSelect items={items} value={value} onChange={setValue} />
    </Box>
  );
};

export const Disabled = () => {
  const [value, setValue] = React.useState<TNavSelectItem>(items[0]);
  return (
    <Box style={{ marginLeft: 400, minWidth: 100 }}>
      <NavSelect disabled items={items} value={value} onChange={setValue} />
    </Box>
  );
};
