import React from "react";

import { Nav } from "./index";
import { NavSelect as NavSelectComponent, TNavSelectItem } from "./nav-select";

const config = {
  component: Nav,
  title: "Components/Nav",
};

const statuses = [
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
