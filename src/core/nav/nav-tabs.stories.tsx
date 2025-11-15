import type { Meta } from "@storybook/react";
import { useState } from "react";

import { MaterialIcon } from "../../icons/material-icon";
import { Box } from "../box";
import { NavTabItem, NavTabs as Tabs } from "./nav-tabs";

const meta = {
  title: "Components/Nav",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;

const items: NavTabItem[] = [
  {
    id: "1",
    title: "Messaging",
    icon: () => <MaterialIcon icon="chat" />,
    iconColor: "violet",
    htmlProps: {
      "aria-controls": "panel-1",
    },
  },
  {
    id: "2",
    title: "Teamwork",
    icon: () => <MaterialIcon icon="person" />,
    iconColor: "green",
    htmlProps: {
      "aria-controls": "panel-2",
    },
  },
  {
    id: "3",
    title: "Documents",
    icon: () => <MaterialIcon icon="folder" />,
    iconColor: "blue",
    htmlProps: {
      "aria-controls": "panel-3",
    },
  },
  {
    id: "4",
    title: "Marketing",
    icon: () => <MaterialIcon icon="call" />,
    iconColor: "orange",
    htmlProps: {
      "aria-controls": "panel-4",
    },
  },
  {
    id: "5",
    title: "Purchases",
    icon: () => <MaterialIcon icon="shopping_bag" />,
    iconColor: "hotpink",
    htmlProps: {
      "aria-controls": "panel-5",
    },
  },
  {
    id: "6",
    title: "CRM",
    icon: () => <MaterialIcon icon="support_agent" />,
    iconColor: "purple",
    htmlProps: {
      "aria-controls": "panel-6",
    },
  },
  {
    id: "7",
    title: "Invoicing",
    icon: () => <MaterialIcon icon="receipt_long" />,
    iconColor: "teal",
    htmlProps: {
      "aria-controls": "panel-7",
    },
  },
];

export const NavTabs = () => {
  const [selected, setSelected] = useState<NavTabItem>();
  return (
    <Box>
      <Box
        border
        p={2}
        overflow="hidden"
        style={{
          width: "max-content",
          maxWidth: "100%",
          resize: "horizontal",
        }}
      >
        <Tabs data-testid="nav-tabs" items={items} onItemSelect={setSelected} />
        <Box p={4} overflow="hidden">
          {items.map((item) => (
            <Box
              key={item.id}
              id={item.htmlProps?.["aria-controls"]}
              role="tabpanel"
              hidden={selected?.id !== item.id}
            >
              Panel for {item.title}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
