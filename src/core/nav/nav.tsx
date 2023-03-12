import React from "react";
import { Box } from "../box";
import { NavProps } from "./types";

export function Nav(props: NavProps) {
  const { items, onRender, onItemRender } = props;
  if (onRender) {
    return onRender(props);
  }

  return (
    <Box d="flex">
      {items?.map((item) => (
        <React.Fragment key={item.id}>
          {onItemRender && onItemRender(item)}
        </React.Fragment>
      ))}
    </Box>
  );
}

export default Nav;
