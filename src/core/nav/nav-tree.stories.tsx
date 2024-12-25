import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";

import { MaterialIcon } from "../../icons/material-icon";
import { Box } from "../box";
import { Input } from "../input";
import { NavTreeItem, NavTreeProps, NavTree as Tree } from "./nav-tree";

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

type NavTreeMenuItem = NavTreeItem & {
  icon?: () => React.ReactNode;
};

const MENUS = [
  {
    id: "1",
    title: "Messaging",
    icon: () => <MaterialIcon icon="chat" />,
    iconColor: "violet",
    items: [
      { id: "101", title: "Inbox" },
      { id: "102", title: "Important" },
      { id: "103", title: "Archived" },
      {
        id: "104",
        title: "Mailing lists",
        items: [
          { id: "1041", title: "My Mailing lists" },
          { id: "1042", title: "All Mailing lists" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Teamwork",
    icon: () => <MaterialIcon icon="person" />,
    iconColor: "green",
    items: [
      {
        id: "201",
        title: "Tasks",
        icon: () => <MaterialIcon icon="list" />,
        items: [
          { id: "2011", title: "My tasks" },
          { id: "2012", title: "All tasks" },
        ],
      },
      {
        id: "202",
        title: "Teams",
        icon: () => <MaterialIcon icon="list" />,
        items: [
          { id: "2021", title: "My teams" },
          { id: "2022", title: "All teams" },
        ],
      },
      { id: "203", title: "General" },
    ],
  },
  {
    id: "3",
    title: "Documents",
    icon: () => <MaterialIcon icon="folder" />,
    iconColor: "blue",
    items: [
      { id: "301", title: "All Documents" },
      { id: "302", title: "My Documents" },
      {
        id: "303",
        title: "Configuration",
        items: [{ id: "3031", title: "Tags" }],
      },
    ],
  },
  {
    id: "4",
    title: "Marketing",
    icon: () => <MaterialIcon icon="call" />,
    iconColor: "orange",
    items: [
      { id: "401", title: "Targets" },
      { id: "402", title: "Campaigns" },
      {
        id: "403",
        title: "Configuration",
        items: [
          { id: "4031", title: "Campaign Types" },
          { id: "4032", title: "Template" },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Purchases",
    icon: () => <MaterialIcon icon="shopping_bag" />,
    iconColor: "hotpink",
    items: [
      { id: "501", title: "Customers" },
      { id: "502", title: "Contacts" },
      { id: "503", title: "Products & services" },
      {
        id: "505",
        title: "Internal purchase requests",
        icon: () => <MaterialIcon icon="request_quote" />,
        iconColor: "hotpink",
      },
      { id: "506", title: "Purchase quotations" },
      { id: "507", title: "Purchase orders" },
      { id: "508", title: "ABC Analysis" },
      {
        id: "509",
        title: "Reportings",
        items: [
          { id: "5091", title: "Purchase Buyer" },
          { id: "5092", title: "Purchase Manager" },
          {
            id: "5093",
            title: "Maps",
            items: [{ id: "50931", title: "Suppliers" }],
          },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "CRM",
    icon: () => <MaterialIcon icon="support_agent" />,
    iconColor: "purple",
    items: [
      { id: "601", title: "Leads" },
      { id: "602", title: "Customers" },
      { id: "603", title: "Contacts" },
      { id: "604", title: "Catalogs" },
      { id: "605", title: "Events" },
      { id: "606", title: "Opportunities" },
      { id: "607", title: "Sale quotations" },
      { id: "608", title: "Objectives" },
    ],
  },
  {
    id: "7",
    title: "Invoicing",
    icon: () => <MaterialIcon icon="receipt_long" />,
    iconColor: "teal",
    items: [
      { id: "701", title: "Cust. Invoices" },
      { id: "702", title: "Cust. Refunds" },
      { id: "703", title: "Suppl. Invoices" },
      { id: "704", title: "My awaiting PFP" },
      { id: "705", title: "Suppl. Refunds" },
    ],
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

function RenderNavTree(props: NavTreeProps) {
  const [items, setItems] = useState(props.items);
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
    selectOnClick: true,
  },
  render: RenderNavTree,
};

export const NavTreeMenu: Story = {
  args: {
    items: MENUS,
    checkbox: false,
    arrowPosition: "end",
    toggleOnClick: true,
    renderTitle(props) {
      const { item } = props;
      const { title } = item;
      const { icon: Icon } = item as NavTreeMenuItem;
      return (
        <Box d="flex" g={2} alignItems="center">
          <Box d="flex" p={1}>
            {Icon && <Icon />}
          </Box>
          <Box>{title}</Box>
        </Box>
      );
    },
  },
  render: RenderNavTree,
};
