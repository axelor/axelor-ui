import type { Meta, StoryObj } from "@storybook/react";

import { useCallback, useEffect, useRef, useState } from "react";
import { MaterialIcon } from "../../icons/material-icon";
import { Select } from "./select";

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

export const Basic: Story = {
  render: () => (
    <div style={{ width: 250 }}>
      <Select
        options={OPTIONS}
        optionKey={(x) => x.value}
        optionLabel={(x) => x.title}
        optionEqual={(o, v) => o.value === v.value}
      />
    </div>
  ),
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
  return (
    <div style={{ width: 250 }}>
      <Select
        value={value}
        options={OPTIONS}
        optionKey={(x) => x.value}
        optionLabel={(x) => x.title}
        optionEqual={(o, v) => o.value === v.value}
        onCreate={(text) => {
          setValue({
            title: text.toUpperCase(),
            value: text,
          });
        }}
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
