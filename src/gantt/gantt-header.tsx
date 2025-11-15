import React, { useEffect, useState } from "react";

import { Box, useClassNames } from "../core";
import { findDataProp, makeTestId } from "../core/system/utils";

import * as TYPES from "./types";

import classes from "./gantt.module.scss";

export const GanttHeader = React.memo(function GanttHeader(props: {
  items: TYPES.GanttHeaderItem[];
}) {
  const { items } = props;
  const [renderItems, setRenderItems] = useState<TYPES.GanttHeaderItem[]>([]);
  const classNames = useClassNames();
  const testId = findDataProp(props, "data-testid");

  useEffect(() => {
    const id = window.requestIdleCallback(() => {
      setRenderItems(items);
    });
    return () => window.cancelIdleCallback(id);
  }, [items]);

  return (
    <div data-testid={testId}>
      <div className={classes.header}>
        {renderItems.map((item, i: number) => (
          <Box
            key={i}
            className={classNames(classes.block, {
              [classes.highlight]: item.highlight,
            })}
            color="secondary"
            style={{
              minWidth: item.width,
              maxWidth: item.width,
            }}
            data-testid={makeTestId(testId, "period", i)}
          >
            {item.title}
          </Box>
        ))}
      </div>
    </div>
  );
});
