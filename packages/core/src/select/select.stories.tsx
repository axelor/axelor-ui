import React from 'react';
import { Box } from '../box';
import { Select } from '../select';

export default {
  component: Select,
  title: 'Components/Select',
};

function FormControl({ label, children }: any) {
  return (
    <Box mb={2}>
      <Box>{label}</Box>
      <Box>{children}</Box>
    </Box>
  );
}

const alphabets = new Array(26).fill(65).map((code, i) => {
  const char = String.fromCharCode(code + i);
  return { title: char, value: char.toLowerCase() };
});

const colors = [
  { title: 'Green', code: 'green' },
  { title: 'Red', code: 'red' },
  { title: 'Blue', code: 'blue' },
  { title: 'Orange', code: 'orange' },
  { title: 'White', code: 'white' },
  { title: 'Black', code: 'black' },
  { title: 'Grey', code: 'grey' },
  { title: 'Olive', code: 'olive' },
  { title: 'Purple', code: 'purple' },
  { title: 'Brown', code: 'brown' },
  { title: 'Pink', code: 'pink' },
  { title: 'Yellow', code: 'yellow' },
  { title: 'Sky', code: 'sky' },
  { title: 'Navy', code: 'navy' },
];

export const Basic = () => {
  const [value, setValue] = React.useState<any>(alphabets[0]);
  return (
    <FormControl label="Characters">
      <Select
        value={value}
        onChange={setValue}
        options={alphabets}
        optionLabel="title"
        optionValue="value"
      />
    </FormControl>
  );
};

const fetchColors = (colorStr: string) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        colorStr
          ? colors.filter(color =>
              color.title.toLowerCase().includes(colorStr.toLowerCase())
            )
          : colors
      );
    }, 1500);
  });
};

export const Async = () => {
  const [value, setValue] = React.useState<any>(null);
  return (
    <FormControl label="Colors">
      <Select
        value={value}
        onChange={setValue}
        fetchOptions={fetchColors}
        optionLabel="title"
        optionValue="code"
      />
    </FormControl>
  );
};

export const Multiple = () => {
  const [value, setValue] = React.useState<any>(null);
  return (
    <FormControl label="Colors">
      <Select
        isMulti
        value={value}
        onChange={setValue}
        fetchOptions={fetchColors}
        optionLabel="title"
        optionValue="code"
      />
    </FormControl>
  );
};
