import React from 'react';
import { Box } from '../box';
import { TNavSelectItem, NavSelect } from './nav-select';

const StoriesConfig = {
  component: NavSelect,
  title: 'Components/NavSelect',
  decorators: [
    (
      Story: React.JSXElementConstructor<any>,
      { globals: { direction } }: any
    ) => {
      return (
        <Box
          style={{
            ...(direction === 'rtl'
              ? { marginRight: 400 }
              : { marginLeft: 400 }),
            minWidth: 100,
          }}
        >
          <Story />
        </Box>
      );
    },
  ],
};

export default StoriesConfig;

const items = [
  { title: 'Draft', value: 'draft' },
  { title: 'Open', value: 'open' },
  { title: 'Closed', value: 'closed' },
  { title: 'Cancelled', value: 'cancelled' },
];

export const Basic = () => {
  const [value, setValue] = React.useState<TNavSelectItem | null>(null);
  return <NavSelect items={items} value={value} onChange={setValue} />;
};

export const Disabled = () => {
  const [value, setValue] = React.useState<TNavSelectItem>(items[0]);
  return <NavSelect disabled items={items} value={value} onChange={setValue} />;
};
