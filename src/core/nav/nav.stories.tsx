import React from "react";
import { ReactComponent as BiChat } from "bootstrap-icons/icons/chat.svg";
import { ReactComponent as BiPerson } from "bootstrap-icons/icons/person.svg";
import { ReactComponent as BiFolder } from "bootstrap-icons/icons/folder.svg";
import { ReactComponent as BiBroadcast } from "bootstrap-icons/icons/broadcast.svg";
import { ReactComponent as BiBullsEye } from "bootstrap-icons/icons/bullseye.svg";
import { ReactComponent as BiChatDots } from "bootstrap-icons/icons/chat-dots.svg";
import { ReactComponent as BiGrid } from "bootstrap-icons/icons/grid-fill.svg";
import { ReactComponent as BiMegaPhone } from "bootstrap-icons/icons/megaphone.svg";
import { ReactComponent as BiListCheck } from "bootstrap-icons/icons/list-check.svg";
import { ReactComponent as BiMenuIcon } from "bootstrap-icons/icons/list.svg";
import { ReactComponent as BiHeartFill } from "bootstrap-icons/icons/heart-fill.svg";
import { ReactComponent as BiShop } from "bootstrap-icons/icons/shop.svg";
import { ReactComponent as BiAlarm } from "bootstrap-icons/icons/alarm.svg";
import { ReactComponent as BiCalendarEvent } from "bootstrap-icons/icons/calendar-event.svg";

import {
  Nav,
  NavBar as NavBarComponent,
  NavTabs as NavTabsComponent,
} from "./index";
import { TNavSelectItem, NavSelect as NavSelectComponent } from "./nav-select";
import { Switch } from "../switch";
import { Icon } from "../icon";
import { Box } from "../box";
import { InputLabel } from "../input-label";

const config = {
  component: Nav,
  title: "Components/Nav",
};

const items = [
  {
    id: "1",
    title: "Messaging",
    icon: () => <Icon as={BiChat} style={{ color: "purple" }} />,
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
    icon: () => <Icon as={BiPerson} style={{ color: "teal" }} />,
    iconColor: "green",
    items: [
      {
        id: "201",
        title: "Tasks",
        icon: BiListCheck,
        items: [
          { id: "2011", title: "My tasks" },
          { id: "2012", title: "All tasks" },
        ],
      },
      {
        id: "202",
        title: "Teams",
        icon: BiListCheck,
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
    icon: BiFolder,
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
    icon: BiBroadcast,
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
    icon: BiBullsEye,
    iconColor: "hotpink",
    items: [
      { id: "501", title: "Customers" },
      { id: "502", title: "Contacts" },
      { id: "503", title: "Products & services" },
      {
        id: "505",
        title: "Internal purchase requests",
        icon: BiMegaPhone,
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
    icon: BiChatDots,
    iconColor: "purple",
    items: [
      { id: "101", title: "Leads" },
      { id: "102", title: "Customers" },
      { id: "103", title: "Contacts" },
      { id: "104", title: "Catalogs" },
      { id: "105", title: "Events" },
      { id: "106", title: "Opportunities" },
      { id: "107", title: "Sale quotations" },
      { id: "108", title: "Objectives" },
    ],
  },
  {
    id: "7",
    title: "Invoicing",
    icon: BiGrid,
    iconColor: "teal",
    items: [
      { id: "101", title: "Cust. Invoices" },
      { id: "102", title: "Cust. Refunds" },
      { id: "103", title: "Suppl. Invoices" },
      { id: "104", title: "My awaiting PFP" },
      { id: "105", title: "Suppl. Refunds" },
    ],
  },
];

export const Navbar = () => {
  const [float, setFloat] = React.useState(false);
  return (
    <Box>
      <Icon
        cursor="pointer"
        as={BiMenuIcon}
        onClick={() => setFloat((float) => !float)}
      />
      <Box
        overflow="auto"
        style={{
          width: float ? 60 : 250,
          height: "calc(100vh - 2rem)",
          background: "#FBFBFF",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <NavBarComponent items={items} float={float} />
      </Box>
    </Box>
  );
};

export const NavTabs = () => {
  const [tabs, setTabs] = React.useState<any>([
    {
      id: "tab1",
      title: "Calendar",
      icon: ({ color }) => <Icon as={BiCalendarEvent} style={{ color }} />,
      iconColor: "purple",
    },
    { id: "tab2", title: "Teams", icon: BiHeartFill, iconColor: "orange" },
    { id: "tab3", title: "Notifications", icon: BiAlarm, iconColor: "red" },
    {
      id: "tab4",
      title: "Purchase Orders",
      icon: BiShop,
      iconColor: "green",
    },
    {
      id: "tab5",
      title: "Messaging",
      icon: BiChat,
      iconColor: "violet",
    },
    { id: "tab6", title: "Teams", icon: BiPerson, iconColor: "blue" },
    { id: "tab7", title: "Invoicing", icon: BiGrid, iconColor: "teal" },
    {
      id: "tab8",
      title: "CRM",
      icon: BiChatDots,
      iconColor: "royalblue",
    },
  ]);
  const [active, setActive] = React.useState<any>("tab1");
  const [draggable, setDraggable] = React.useState(false);

  const handleTabReorder = React.useCallback(
    (dragIndex?: number, hoverIndex?: number) => {
      setTabs((items: any) => {
        const [dragCard] = items.splice(dragIndex, 1);
        items.splice(hoverIndex, 0, dragCard);
        return [...items];
      });
    },
    []
  );

  return (
    <Box>
      <Box d="flex" alignItems="center">
        <InputLabel me={2}>Draggable</InputLabel>
        <Switch
          checked={draggable}
          onChange={(e: any) => setDraggable(e.target.checked)}
        />
      </Box>
      <NavTabsComponent
        draggable={draggable}
        items={tabs}
        value={active}
        onChange={(id) => setActive(id)}
        onClose={console.log}
        onReorder={handleTabReorder}
      />
    </Box>
  );
};

const statuses: any[] = [
  { title: "Draft", value: "draft" },
  { title: "Open", value: "open" },
  { title: "Closed", value: "closed" },
  { title: "Cancelled", value: "cancelled" },
];

export const NavSelect = () => {
  const [value, setValue] = React.useState<TNavSelectItem | null>(statuses[0]);
  return (
    <NavSelectComponent items={statuses} value={value} onChange={setValue} />
  );
};

export default config;
