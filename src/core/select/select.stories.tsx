import React from "react";
import { ReactComponent as BiPencil } from "bootstrap-icons/icons/pencil.svg";
import { ReactComponent as BiPlusSquare } from "bootstrap-icons/icons/plus-square.svg";
import { ReactComponent as BiFileEarmark } from "bootstrap-icons/icons/file-earmark-text.svg";

import { Input } from "../input";
import { Box } from "../box";
import { Select } from "../select";

const SelectStories = {
  component: Select,
  title: "Components/Select",
};

function FormControl({ label, children }: any) {
  return (
    <Box mb={2}>
      <Box>{label}</Box>
      <Box>{children}</Box>
    </Box>
  );
}

const colors = [
  { title: "Green", code: "green" },
  { title: "Red", code: "red" },
  { title: "Blue", code: "blue" },
  { title: "Orange", code: "orange" },
  { title: "White", code: "white" },
  { title: "Black", code: "black" },
  { title: "Grey", code: "grey" },
  { title: "Olive", code: "olive" },
  { title: "Purple", code: "purple" },
  { title: "Brown", code: "brown" },
  { title: "Pink", code: "pink" },
  { title: "Yellow", code: "yellow" },
  { title: "Sky", code: "sky" },
  { title: "Navy", code: "navy" },
];

export const Basic = () => {
  const [value, setValue] = React.useState<any>(colors[0]);
  return (
    <FormControl label="Colors">
      <Select
        value={value}
        onChange={setValue}
        options={colors}
        optionLabel="title"
        optionValue="code"
        noOptionsMessage={() => "No results"}
      />
    </FormControl>
  );
};

const fetchColors = (colorStr: string) => {
  console.log("fetch colors");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        colorStr
          ? colors.filter((color) =>
              color.title.toLowerCase().includes(colorStr.toLowerCase())
            )
          : colors
      );
    }, 2000);
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
  const [value, setValue] = React.useState<any>(colors.slice(0, 2));
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
  return `Create "${str}"`;
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
    setMultiValue((values) => (values || []).concat(newColor));
    colors.push(newColor);
  }, []);

  const handleChecked = (event: any) => {
    setAsync(event.target.checked);
  };

  const selectProps = isAsync
    ? { key: "async-select", fetchOptions: fetchColors }
    : { key: "static-select", options: colors };

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

export const Actions = () => {
  const [value, setValue] = React.useState<any>(colors[0]);
  const [canCreate, setCreate] = React.useState(true);
  const [canRead, setRead] = React.useState(true);
  const [canEdit, setEdit] = React.useState(true);

  return (
    <Box>
      <Box d="flex">
        <Box m={1}>
          <Input
            type="checkbox"
            checked={canCreate}
            onChange={(e) => setCreate((e.target as HTMLInputElement).checked)}
          />
          <Box as="label" ms={2}>
            Create
          </Box>
        </Box>
        <Box m={1}>
          <Input
            type="checkbox"
            checked={canRead}
            onChange={(e) => setRead((e.target as HTMLInputElement).checked)}
          />
          <Box as="label" ms={2}>
            Read
          </Box>
        </Box>
        <Box m={1}>
          <Input
            type="checkbox"
            checked={canEdit}
            onChange={(e) => setEdit((e.target as HTMLInputElement).checked)}
          />
          <Box as="label" ms={2}>
            Edit
          </Box>
        </Box>
      </Box>
      <FormControl label="Colors">
        <Select
          icons={[
            ...(value && canEdit ? [{ id: "search", icon: BiPencil }] : []),
            ...(canCreate ? [{ id: "new", icon: BiPlusSquare }] : []),
            ...(canRead && value ? [{ id: "edit", icon: BiFileEarmark }] : []),
          ]}
          value={value}
          onChange={setValue}
          options={colors}
          optionLabel="title"
          optionValue="code"
        />
      </FormControl>
    </Box>
  );
};

export default SelectStories;
