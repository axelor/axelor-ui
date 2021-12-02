import React from 'react';
import { Input } from '../input';
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
    }, 800);
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

function CreateNewOption(str: string) {
  return `Create.. "${str}"`;
}

export const Creatable = () => {
  const [isAsync, setAsync] = React.useState(true);

  const [value, setValue] = React.useState<any>(null);
  const [multiValue, setMultiValue] = React.useState<any[]>([]);

  const handleOnCreate = React.useCallback(function handleOnCreate(value) {
    const newColor = {
      title: value,
      code: value.toLowerCase(),
    };
    setValue(newColor);
    colors.push(newColor);
  }, []);

  const handleMultiOnCreate = React.useCallback(function handleOnCreate(value) {
    const newColor = {
      title: value,
      code: value.toLowerCase(),
    };
    setMultiValue(values => (values || []).concat(newColor));
    colors.push(newColor);
  }, []);

  const handleChecked = (event: any) => {
    setAsync(event.target.checked);
  };

  const selectProps = isAsync
    ? { key: 'async-select', fetchOptions: fetchColors }
    : { key: 'static-select', options: colors };

  return (
    <Box>
      <Box m={1}>
        <Input type="checkbox" checked={isAsync} onChange={handleChecked} />
        <Box as="label" ms={2}>
          Async
        </Box>
      </Box>
      <FormControl label="Colors">
        <Select
          isCreatable
          value={value}
          optionLabel="title"
          optionValue="code"
          createOption={CreateNewOption}
          onChange={setValue}
          onCreate={handleOnCreate}
          {...selectProps}
        />
      </FormControl>
      <FormControl label="Colors (Multi)">
        <Select
          isCreatable
          isMulti
          value={multiValue}
          optionLabel="title"
          optionValue="code"
          createOption={CreateNewOption}
          onChange={setMultiValue}
          onCreate={handleMultiOnCreate}
          {...selectProps}
        />
      </FormControl>
    </Box>
  );
};
