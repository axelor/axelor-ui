import { useState } from 'react';
import { Meta } from '@storybook/react';

import { Box } from '../box';
import { TextField } from './text-field';

import { ReactComponent as BiCalendar } from 'bootstrap-icons/icons/calendar.svg';
import { ReactComponent as BiAlarm } from 'bootstrap-icons/icons/alarm.svg';
import { ReactComponent as BiTranslate } from 'bootstrap-icons/icons/translate.svg';

const config = {
  component: TextField,
  title: 'Components/TextField',
  decorators: [
    Story => (
      <Box style={{ width: 400 }}>
        <Story />
      </Box>
    ),
  ],
} as Meta;

export const Basic = () => {
  const [value, setValue] = useState('');
  return (
    <Box display="flex" flexDirection="column" gap="1rem">
      <TextField
        label={
          <Box display="flex" alignItems="center">
            <Box pe={2}>Field Label</Box>
            <BiTranslate />
          </Box>
        }
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        icons={[
          {
            id: 'calender',
            icon: BiCalendar,
          },
          {
            id: 'alarm',
            icon: BiAlarm,
          },
        ]}
      />
      <TextField
        label="Field Label"
        value={value}
        invalid
        onChange={(e: any) => setValue(e.target.value)}
        icons={[
          {
            id: 'calender',
            icon: BiCalendar,
          },
          {
            id: 'alarm',
            icon: BiAlarm,
          },
        ]}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
      <TextField
        label="Disabled Field"
        value={value}
        disabled
        onChange={(e: any) => setValue(e.target.value)}
        icons={[
          {
            id: 'calender',
            icon: BiCalendar,
          },
          {
            id: 'alarm',
            icon: BiAlarm,
          },
        ]}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </Box>
  );
};

export default config;
