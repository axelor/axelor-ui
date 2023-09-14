import type { Meta, StoryObj } from "@storybook/react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "../../icons/material-icon";
import { Badge } from "../badge";
import { Box } from "../box";
import { Input } from "../input";
import { InputLabel } from "../input-label";
import { Select, SelectValue } from "./select";

const meta: Meta<typeof Select> = {
  title: "Components/Select2",
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

type Fruit = {
  title: string;
  value: string;
};

const FRUITS = [
  "Alfalfa Sprouts",
  "Apple",
  "Apricot",
  "Artichoke",
  "Asian Pear",
  "Asparagus",
  "Atemoya",
  "Avocado",
  "Bamboo Shoots",
  "Banana",
  "Bean Sprouts",
  "Beans",
  "Beets",
  "Belgian Endive",
  "Bell Peppers",
  "Bitter Melon",
  "Blackberries",
  "Blueberries",
  "Bok Choy",
  "Boniato",
  "Boysenberries",
  "Broccoflower",
  "Broccoli",
  "Brussels Sprouts",
  "Cabbage",
  "Cactus Pear",
  "Cantaloupe",
  "Carambola",
  "Carrots",
  "Casaba Melon",
  "Cauliflower",
  "Celery",
  "Chayote",
  "Cherimoya",
  "Cherries",
  "Coconuts",
  "Collard Greens",
  "Corn",
  "Cranberries",
  "Cucumber",
  "Dates",
  "Dried Plums",
  "Eggplant",
  "Endive",
  "Escarole",
  "Feijoa",
  "Fennel",
  "Figs",
  "Garlic",
  "Gooseberries",
  "Grapefruit",
  "Grapes",
  "Green Beans",
  "Green Onions",
  "Greens",
  "Guava",
  "Hominy",
  "Honeydew Melon",
  "Horned Melon",
  "Iceberg Lettuce",
  "Jerusalem Artichoke",
  "Jicama",
  "Kale",
  "Kiwifruit",
  "Kohlrabi",
  "Kumquat",
  "Leeks",
  "Lemons",
  "Lettuce",
  "Lima Beans",
  "Limes",
  "Longan",
  "Loquat",
  "Lychee",
  "Madarins",
  "Malanga",
  "Mandarin Oranges",
  "Mangos",
  "Mulberries",
  "Mushrooms",
  "Napa",
  "Nectarines",
  "Okra",
  "Onion",
  "Oranges",
  "Papayas",
  "Parsnip",
  "Passion Fruit",
  "Peaches",
  "Pears",
  "Peas",
  "Peppers",
  "Persimmons",
  "Pineapple",
  "Plantains",
  "Plums",
  "Pomegranate",
  "Potatoes",
  "Prickly Pear",
  "Prunes",
  "Pummelo",
  "Pumpkin",
  "Quince",
  "Radicchio",
  "Radishes",
  "Raisins",
  "Raspberries",
  "Red Cabbage",
  "Rhubarb",
  "Romaine Lettuce",
  "Rutabaga",
  "Shallots",
  "Snow Peas",
  "Spinach",
  "Sprouts",
  "Squash",
  "Strawberries",
  "String Beans",
  "Sweet Potato",
  "Tangelo",
  "Tangerines",
  "Tomatillo",
  "Tomato",
  "Turnip",
  "Ugli Fruit",
  "Water Chestnuts",
  "Watercress",
  "Watermelon",
  "Waxed Beans",
  "Yams",
  "Yellow Squash",
  "Yuca/Cassava",
  "Zucchini Squash",
];

const OPTIONS: Fruit[] = FRUITS.map(
  (name) => ({ title: name, value: name }),
  {},
);

export const Basic = () => {
  const [attrs, setAttrs] = useState<{
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    autoComplete?: boolean;
  }>({
    autoComplete: false,
  });

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof attrs;
    setAttrs((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const renderCheckBox = (name: keyof typeof attrs) => {
    const checked = attrs[name] ?? false;
    return (
      <InputLabel>
        <Input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleCheckBox}
        />{" "}
        {name}
      </InputLabel>
    );
  };

  return (
    <div style={{ width: 250 }}>
      <Box d="flex" flexDirection="column">
        {renderCheckBox("required")}
        {renderCheckBox("readOnly")}
        {renderCheckBox("disabled")}
        {renderCheckBox("autoComplete")}
      </Box>
      <Select
        placeholder="Select a value"
        readOnly={attrs.readOnly}
        required={attrs.required}
        disabled={attrs.disabled}
        autoComplete={attrs.autoComplete}
        options={OPTIONS}
        optionKey={(x) => x.value}
        optionLabel={(x) => x.title}
        optionEqual={(o, v) => o.value === v.value}
      />
    </div>
  );
};

export const Actions: Story = {
  render: () => (
    <div style={{ width: 250 }}>
      <Select
        options={OPTIONS}
        optionKey={(x) => x.value}
        optionLabel={(x) => x.title}
        optionEqual={(o, v) => o.value === v.value}
        clearIcon={false}
        toggleIcon={false}
        icons={[
          {
            icon: <MaterialIcon icon="add" />,
          },
          {
            icon: <MaterialIcon icon="delete" />,
          },
        ]}
      />
    </div>
  ),
};

export const Creatable = () => {
  const [value, setValue] = useState<Fruit | null>(null);
  const [text, setText] = useState("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value.trim());
    },
    [],
  );

  const handleChange = useCallback((value: SelectValue<Fruit, false>) => {
    setValue(value as Fruit | null);
  }, []);

  const extras = useMemo(
    () =>
      value
        ? []
        : [
            {
              key: "create",
              title: `Create ${text}...`,
              onClick: () => {
                setValue({
                  title: text.toUpperCase(),
                  value: text,
                });
              },
            },
            {
              key: "select",
              title: `Select ${text}...`,
              onClick: () => {
                setValue({
                  title: text.toUpperCase(),
                  value: text,
                });
              },
            },
          ],
    [text, value],
  );

  return (
    <div style={{ width: 250 }}>
      <Select
        value={value}
        onChange={handleChange}
        onInputChange={handleInputChange}
        options={OPTIONS}
        optionKey={(x) => x.value}
        optionLabel={(x) => x.title}
        optionEqual={(o, v) => o.value === v.value}
        customOptions={extras}
      />
    </div>
  );
};

export const Multiple: Story = {
  render: () => (
    <div style={{ width: 250 }}>
      <Select
        multiple
        options={OPTIONS}
        optionKey={(x) => x.value}
        optionLabel={(x) => x.title}
        optionEqual={(o, v) => o.value === v.value}
      />
    </div>
  ),
};

export const Async = () => {
  const [options, setOptions] = useState<Fruit[]>([]);
  const [text, setText] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      setText(inputValue);
    },
    [],
  );

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setOptions(
        OPTIONS.filter((x) =>
          x.title.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }, 300);
  }, [text]);

  return (
    <div style={{ width: 250 }}>
      <Select
        multiple
        options={options}
        optionKey={(x) => x.value}
        optionLabel={(x) => x.title}
        optionEqual={(o, v) => o.value === v.value}
        optionMatch={() => true}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export const Renderers = () => {
  return (
    <div style={{ width: 250 }}>
      <Select
        multiple
        autoComplete={false}
        options={OPTIONS}
        optionKey={(x) => x.value}
        optionLabel={(x) => x.title}
        optionEqual={(o, v) => o.value === v.value}
        renderOption={({ option }) => <strong>{option.title}</strong>}
        renderValue={({ option }) => (
          <Badge bg="primary">
            <Box d="flex" alignItems="center" g={1}>
              <span>{option.title}</span>
              <MaterialIcon icon="close" fontSize="1rem" />
            </Box>
          </Badge>
        )}
      />
    </div>
  );
};
