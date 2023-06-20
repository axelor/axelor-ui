import { useState } from "react";

import { MaterialIcon } from "../../icons/material-icon";
import { Box } from "../box";
import { NavMenu as SideMenu } from "./nav-menu";

const config = {
  component: SideMenu,
  title: "Components/Nav",
};

export default config;

const items = [
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

export function NavMenu() {
  const [mode, setMode] = useState<"accordion" | "icons">("accordion");
  const [show, setShow] = useState<"inline" | "overlay" | "icons" | "none">(
    "inline"
  );

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMode(e.target.value as any);
  };

  const handleShowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShow(e.target.value as any);
  };

  return (
    <Box d="flex" flexDirection="column" g={2}>
      <Box d="flex" g={2}>
        <strong>Mode:</strong>
        <Box as="label" d="flex" g={2}>
          <input
            type="radio"
            name="mode"
            value="accordion"
            checked={mode === "accordion"}
            onChange={handleModeChange}
          />
          Accordion
        </Box>
        <Box as="label" d="flex" g={2}>
          <input
            type="radio"
            name="mode"
            value="icons"
            checked={mode === "icons"}
            onChange={handleModeChange}
          />
          Icons
        </Box>
      </Box>
      <Box d="flex" g={2}>
        <strong>Show:</strong>
        <Box as="label" d="flex" g={2}>
          <input
            type="radio"
            name="show"
            value="inline"
            checked={show === "inline"}
            onChange={handleShowChange}
          />
          Inline
        </Box>
        <Box as="label" d="flex" g={2}>
          <input
            type="radio"
            name="show"
            value="overlay"
            checked={show === "overlay"}
            onChange={handleShowChange}
          />
          Overlay
        </Box>
        <Box as="label" d="flex" g={2}>
          <input
            type="radio"
            name="show"
            value="icons"
            checked={show === "icons"}
            onChange={handleShowChange}
          />
          Icons
        </Box>

        <Box as="label" d="flex" g={2}>
          <input
            type="radio"
            name="show"
            value="none"
            checked={show === "none"}
            onChange={handleShowChange}
          />
          None
        </Box>
      </Box>
      <Box d="flex" style={{ maxWidth: 600, height: 500 }} border p={2} g={2}>
        <Box d="flex" border>
          <SideMenu mode={mode} show={show} items={items} />
        </Box>
        <Box flex={1} border></Box>
      </Box>
    </Box>
  );
}
