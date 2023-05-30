import React, { useEffect, useState } from "react";
import * as TYPES from "./types";
import { Box, useClassNames } from "../core";
import classes from "./gantt.module.scss";

export const GanttHeader = React.memo(function GanttHeader(props: {
  items: TYPES.GanttHeaderItem[];
}) {
  const { items } = props;
  const [renderItems, setRenderItems] = useState<TYPES.GanttHeaderItem[]>([]);
  const classNames = useClassNames();

  useEffect(() => {
    const id = window.requestIdleCallback(() => {
      setRenderItems(items);
    });
    return () => window.cancelIdleCallback(id);
  }, [items]);

  return (
    <div>
      <div className={classes.header}>
        {renderItems.map((item, i: number) => (
          <Box
            key={i}
            className={classNames(classes.block, {
              [classes.highlight]: item.highlight,
            })}
            color="muted"
            style={{
              minWidth: item.width,
              maxWidth: item.width,
            }}
          >
            {item.title}
          </Box>
        ))}
      </div>
    </div>
  );
});
