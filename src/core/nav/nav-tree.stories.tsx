import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";

import { Box } from "../box";
import { Input } from "../input";
import { NavTreeItem, NavTree as Tree } from "./nav-tree";

const meta = {
  title: "Components/Nav",
  component: Tree,
} satisfies Meta<typeof Tree>;

export default meta;

type Story = StoryObj<typeof meta>;

const ITEMS: NavTreeItem[] = [
  {
    id: "id.1",
    title: "Item 1",
    items: [
      {
        id: "id.1.1",
        title: "Item 1.1",
      },
      {
        id: "id.1.2",
        title: "Item 1.2",
        items: [
          {
            id: "id.1.2.1",
            title: "Item 1.2.1",
          },
          {
            id: "id.1.2.2",
            title: "Item 1.2.2",
          },
        ],
      },
    ],
  },
  {
    id: "id.2",
    title: "Item 2",
    items: [],
  },
  {
    id: "id.3",
    title: "Item 3",
  },
];

const ITEMS_LAZY: Record<string, NavTreeItem[]> = {
  "id.2": [
    {
      id: "id.2.1",
      title: "Item 2.1",
    },
    {
      id: "id.2.2",
      title: "Item 2.2",
      items: [],
    },
  ],
  "id.2.2": [
    {
      id: "id.2.2.1",
      title: "Item 2.2.1",
    },
  ],
};

type ItemData = {
  loaded: boolean;
};

async function fetchItems(item: NavTreeItem) {
  return new Promise<NavTreeItem[]>((resolve) => {
    setTimeout(() => {
      resolve(ITEMS_LAZY[item.id] ?? []);
    }, 1000);
  });
}

function update(items: NavTreeItem[], item: NavTreeItem): NavTreeItem[] {
  return items.map((x) => {
    if (x.id === item.id) return { ...x, ...item };
    if (x.items) {
      return { ...x, items: update(x.items, item) };
    }
    return x;
  });
}

function RenderNavTree(props: Story["args"]) {
  const [items, setItems] = useState(ITEMS);
  const [text, setText] = useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const handleToggle = useCallback(async (item: NavTreeItem) => {
    const data = item.data as ItemData;
    if (item.items && item.items.length === 0 && !data?.loaded) {
      const children = await fetchItems(item);
      setItems((prev) => {
        return update(prev, {
          ...item,
          items: children,
          data: {
            loaded: true,
          },
        });
      });
    }
  }, []);

  const filter = useCallback(
    (item: NavTreeItem) =>
      item.title.toLowerCase().includes(text.toLowerCase()),
    [text],
  );

  return (
    <Box p={2} g={2} d="flex" flexDirection="column" style={{ width: 400 }}>
      <Box>
        <Input
          type="text"
          placeholder="Search..."
          value={text}
          onChange={handleChange}
        />
      </Box>
      <Box border p={2}>
        <Tree
          {...props}
          items={items}
          filter={filter}
          filterText={text}
          onItemToggle={handleToggle}
        />
      </Box>
    </Box>
  );
}

export const NavTree: Story = {
  args: {
    items: ITEMS,
    checkbox: true,
  },
  render: RenderNavTree,
};
