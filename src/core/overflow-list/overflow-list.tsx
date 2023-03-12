import * as React from "react";
import { Box } from "../box";
import { withStyled } from "../styled";
import { useClassNames } from "../styles";

import OverflowDropdown from "./overflow-dropdown";
import OverflowScrollList from "./overflow-scroll-list";
import cssStyles from "./overflow-list.module.css";
import { OverflowListProps, OverflowListItemProps } from "./types";

function RenderListItem({ item }: { item: OverflowListItemProps }) {
  return (
    <Box
      p={2}
      d="flex"
      justifyContent="center"
      border
      className={cssStyles.defaultItem}
    >
      {item.title}
    </Box>
  );
}

export const OverflowList = withStyled(Box)<OverflowListProps>((props, ref) => {
  const {
    as,
    dropdownRef,
    items,
    scrollable = false,
    inverse = false,
    vertical = false,
    renderList,
    renderListItem,
    renderOverflow,
    renderOverflowItem,
    renderButton,
    dropdownMenuProps,
    onOverflowChange,
    ...rest
  } = props;
  const Component: any = scrollable ? OverflowScrollList : OverflowDropdown;
  let children: any = renderList && renderList(items);

  if (!children) {
    children = items.map((item, index) =>
      renderListItem ? (
        renderListItem(item, index)
      ) : React.isValidElement(item) ? (
        item
      ) : (
        <RenderListItem key={index} item={item} />
      )
    );
  }
  const classNames = useClassNames();
  const classes = classNames([
    cssStyles.container,
    {
      [cssStyles.vertical]: vertical,
    },
  ]);

  return (
    <Box ref={ref} className={classes}>
      <Component
        {...{
          inverse,
          vertical,
          children,
          renderButton,
          ref: dropdownRef,
          ...(scrollable
            ? {}
            : {
                items,
                as,
                renderOverflow,
                renderOverflowItem,
                dropdownMenuProps,
                onOverflowChange,
              }),
        }}
        {...rest}
      />
    </Box>
  );
});
