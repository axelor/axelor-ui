import React from "react";
import * as TYPES from "./types";
import { Box, useClassNames } from "../core";
import classes from "./gantt.module.scss";

export const RenderList = React.memo(function RenderList({
  items,
  itemClassName,
  itemRenderer,
}: {
  items: TYPES.GanttHeaderItem[];
  itemClassName?: string;
  itemRenderer?: (item: TYPES.GanttHeaderItem) => any;
}) {
  const classNames = useClassNames();
  return (
    <>
      {items.map((item, i: number) => (
        <Box
          className={classNames(classes.block, itemClassName, {
            [classes.highlight]: item.highlight,
          })}
          color="muted"
          key={i}
          style={{
            width: item.width,
          }}
        >
          {itemRenderer ? itemRenderer(item) : item.title}
        </Box>
      ))}
    </>
  );
});

export const GanttHeader = React.memo(function GanttHeader(props: {
  list: TYPES.GanttHeaderItem[];
  subList: TYPES.GanttHeaderItem[];
}) {
  const { list, subList } = props;
  return (
    <div>
      <div className={classes.header}>
        <RenderList items={list} />
      </div>
      <div className={classes.subHeader}>
        <RenderList items={subList} />
      </div>
    </div>
  );
});
