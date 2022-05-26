import { useState } from 'react';
import { Meta } from '@storybook/react';

import { Box } from '../box';
import { Input } from './input';
import { withStyled } from '../styled';

const config = {
  component: Input,
  title: 'Components/Input',
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
    <Input value={value} onChange={(e: any) => setValue(e.target.value)} />
  );
};

export const Disabled = () => {
  return <Input disabled />;
};

export const Invalid = () => {
  return <Input invalid />;
};

export const Placeholder = () => {
  return <Input placeholder="Placeholder" />;
};

export const Readonly = () => {
  return (
    <Box>
      <Input value="Readonly" readOnly />
    </Box>
  );
};

const Range = withStyled(Input)(({ value: valueProp, ...rest }, ref) => {
  const [value, setValue] = useState(valueProp);

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  return (
    <Input
      type="range"
      min="0"
      max="100"
      ref={ref}
      value={value}
      onChange={handleChange}
      {...rest}
    />
  );
});

const Checkbox = withStyled(Input)((props, ref) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: any) => {
    setChecked(event.target.checked);
  };

  return (
    <Box>
      <Input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        {...props}
      />
    </Box>
  );
});

function FormControl({ label, children }: any) {
  return (
    <Box mb={2}>
      <Box>{label}</Box>
      <Box>{children}</Box>
    </Box>
  );
}

export const Types = () => {
  return (
    <Box mt={4}>
      <FormControl label="Text">
        <Input type="text" />
      </FormControl>

      <FormControl label="Text (Max:10)">
        <Input type="text" max="10" />
      </FormControl>

      <FormControl label="Number">
        <Input type="number" />
      </FormControl>

      <FormControl label="Number (Min:0)">
        <Input type="number" min="0" />
      </FormControl>

      <FormControl label="Number (Max:10)">
        <Input type="number" max="10" />
      </FormControl>

      <FormControl label="Number (Step:5)">
        <Input type="number" step={5} max="100" />
      </FormControl>

      <FormControl label="Checkbox">
        <Checkbox />
      </FormControl>

      <FormControl label="Checkbox (Disabled)">
        <Checkbox disabled />
      </FormControl>

      <FormControl label="Radio">
        <Input type="radio" />
      </FormControl>

      <FormControl label="Radio (Disabled)">
        <Input type="radio" disabled />
      </FormControl>

      <FormControl label="Radio (Checked)">
        <Input type="radio" checked={true} onChange={() => {}} />
      </FormControl>

      <FormControl label="Email">
        <Input type="email" />
      </FormControl>

      <FormControl label="Password">
        <Input type="password" />
      </FormControl>

      <FormControl label="Tel">
        <Input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
      </FormControl>

      <FormControl label="Color Picker">
        <Input type="color" />
      </FormControl>

      <FormControl label="Range">
        <Range value="50" />
      </FormControl>

      <FormControl label="Range (Disabled)">
        <Range value="50" disabled />
      </FormControl>

      <FormControl label="Range (Min:Max:Step)">
        <Range value="50" min="0" max="100" step={5} />
      </FormControl>

      <FormControl label="Hidden">
        <Input type="hidden" value="simple-value" />
      </FormControl>

      <FormControl label="File">
        <Input type="file" />
      </FormControl>

      <FormControl label="File (Multiple)">
        <Input type="file" multiple />
      </FormControl>

      <FormControl label="File (Accept:png/jpeg)">
        <Input type="file" accept="image/png, image/jpeg" />
      </FormControl>

      <FormControl label="Date">
        <Input type="date" />
      </FormControl>

      <FormControl label="Date (Min:Max)">
        <Input type="date" min="2021-01-01" max="2021-12-31" />
      </FormControl>

      <FormControl label="Time">
        <Input type="time" />
      </FormControl>

      <FormControl label="Datetime">
        <Input type="datetime-local" />
      </FormControl>

      <FormControl label="Datetime (Min:Max)">
        <Input
          type="datetime-local"
          min="2018-06-07T00:00"
          max="2018-06-14T00:00"
        />
      </FormControl>

      <FormControl label="Month">
        <Input type="month" />
      </FormControl>

      <FormControl label="Month (Min:Max)">
        <Input type="month" min="2018-03" max="2018-08" />
      </FormControl>

      <FormControl label="Week">
        <Input type="week" />
      </FormControl>

      <FormControl label="Week (Min:Max)">
        <Input type="week" min="2018-W18" max="2018-W26" />
      </FormControl>
    </Box>
  );
};

export default config;
