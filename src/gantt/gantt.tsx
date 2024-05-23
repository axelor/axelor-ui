import moment, { Dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { Box, useClassNames, useTheme } from "../core";

import { GanttBody } from "./gantt-body";
import { GanttEdge } from "./gantt-edge";
import { GanttHeader } from "./gantt-header";
import { GanttLine } from "./gantt-line";
import { GanttTable } from "./gantt-table";
import classes from "./gantt.module.scss";
import * as TYPES from "./types";
import { getGraphConfig, getGraphEdges, getHeader } from "./utils";

function GanttView(
  props: Pick<
    TYPES.GanttProps,
    "config" | "onRecordUpdate" | "onRecordConnect" | "onRecordDisconnect"
  > & {
    view: TYPES.GanttType;
    activeRowIndex: number;
    records: TYPES.GanttRecord[];
    startDate: Dayjs;
    endDate: Dayjs;
    hourSize: number;
    cellSize: number;
  },
) {
  const {
    view,
    config,
    records,
    activeRowIndex,
    startDate,
    cellSize,
    hourSize,
    endDate,
    onRecordUpdate,
    onRecordConnect,
    onRecordDisconnect,
  } = props;

  const [list, setList] = useState<TYPES.GanttHeaderItem[]>([]);
  const [items, setItems] = useState<TYPES.GanttHeaderItem[]>([]);

  const edges = React.useMemo(
    () => getGraphEdges(records, startDate, endDate, hourSize),
    [records, startDate, endDate, hourSize],
  );

  useEffect(() => {
    const animationId = window.requestIdleCallback(() => {
      const [list, items] = getHeader(view, startDate, endDate, hourSize);
      setList(list);
      setItems(items);
    });

    return () => {
      window.cancelIdleCallback(animationId);
    };
  }, [view, startDate, endDate, hourSize]);

  return (
    <div className={classes.body}>
      <GanttHeader items={list} />
      <div className={classes.ganttRows}>
        <GanttBody
          items={items}
          activeRowIndex={activeRowIndex}
          totalRecords={records.length}
        >
          {records.map((record, i) => {
            return (
              <GanttLine
                key={i}
                index={i}
                view={view}
                config={config}
                startDate={startDate}
                endDate={endDate}
                hourSize={hourSize}
                cellSize={cellSize}
                data={record}
                onUpdate={onRecordUpdate}
                onConnect={onRecordConnect}
              />
            );
          })}
        </GanttBody>
        {edges.map((edge, i) => (
          <GanttEdge key={i} edge={edge} onDelete={onRecordDisconnect} />
        ))}
      </div>
    </div>
  );
}

export function Gantt({
  className,
  records,
  view,
  items,
  config,
  onRecordView,
  onRecordUpdate,
  onRecordConnect,
  onRecordDisconnect,
}: TYPES.GanttProps) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [activeRow, setActiveRow] = React.useState<number | null>(null);

  const { dir } = useTheme();
  const rtl = dir === "rtl";
  const classNames = useClassNames();

  const graphConfig = React.useMemo(
    () => container && getGraphConfig(records, view, container.offsetWidth),
    [container, records, view],
  );
  const startDateStr = graphConfig?.startDate.format();
  const endDateStr = graphConfig?.endDate.format();

  const [startDate, endDate] = React.useMemo(
    () => [
      startDateStr && moment(startDateStr),
      endDateStr && moment(endDateStr),
    ],
    [startDateStr, endDateStr],
  );

  function handleScroll() {
    if (container) {
      const tableElement = container.previousSibling;
      const { scrollTop } = container;
      if (tableElement && scrollTop >= 0) {
        (tableElement as HTMLElement).scrollTop = scrollTop;
      }
    }
  }

  const activeRowIndex = useMemo(
    () => records.findIndex((r) => r.id === activeRow),
    [records, activeRow],
  );

  return (
    <Box
      d="flex"
      className={classNames(classes.gantt, className, classes.root, {
        [classes.rtl]: rtl,
      })}
    >
      <GanttTable
        {...{ items, records, activeRow, setActiveRow }}
        onView={onRecordView}
      />
      <Box
        ref={setContainer}
        flex="1"
        className={classes.container}
        onScroll={handleScroll}
      >
        {graphConfig && startDate && endDate && (
          <div
            className={classes.gantt}
            style={{
              width: graphConfig.totalWidth,
            }}
          >
            <GanttView
              view={view}
              config={config}
              hourSize={graphConfig.hourSize}
              cellSize={graphConfig.cellWidth}
              startDate={startDate}
              endDate={endDate}
              activeRowIndex={activeRowIndex}
              records={records}
              onRecordConnect={onRecordConnect}
              onRecordDisconnect={onRecordDisconnect}
              onRecordUpdate={onRecordUpdate}
            />
          </div>
        )}
      </Box>
    </Box>
  );
}
