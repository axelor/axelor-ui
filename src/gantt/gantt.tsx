import React from 'react';
import moment from 'moment';
import { Box, useTheme, useClassNames } from '../core';

import * as TYPES from './types';
import { GanttLine } from './gantt-line';
import { GanttHeader } from './gantt-header';
import { GanttBody } from './gantt-body';
import { GanttEdge } from './gantt-edge';
import { GanttTable } from './gantt-table';
import { getGraphConfig, getHeader, getGraphEdges } from './utils';
import classes from './gantt.module.scss';

function GanttView(props: {
  view: TYPES.GanttType;
  activeRowIndex: number;
  records: TYPES.GanttRecord[];
  startDate: moment.Moment;
  endDate: moment.Moment;
  hourSize: number;
  cellSize: number;
  onRecordUpdate?: TYPES.GanttProps['onRecordUpdate'];
  onRecordConnect?: TYPES.GanttProps['onRecordConnect'];
  onRecordDisconnect?: TYPES.GanttProps['onRecordDisconnect'];
}) {
  const {
    view,
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

  const [list, items] = React.useMemo(
    () => getHeader(view, startDate, endDate, hourSize),
    [view, startDate, endDate, hourSize]
  );
  const edges = React.useMemo(
    () => getGraphEdges(records, startDate, endDate, hourSize),
    [records, startDate, endDate, hourSize]
  );

  return (
    <div className={classes.body}>
      <GanttHeader list={list} subList={items} />
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
  records,
  view,
  items,
  onRecordUpdate,
  onRecordConnect,
  onRecordDisconnect,
}: TYPES.GanttProps) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [activeRowIndex, setActiveRowIndex] = React.useState(-1);

  const { dir } = useTheme();
  const rtl = dir === 'rtl';
  const classNames = useClassNames();

  const config = React.useMemo(
    () => container && getGraphConfig(records, view, container.offsetWidth),
    [container, records, view]
  );
  const startDateStr = config?.startDate.format();
  const endDateStr = config?.endDate.format();

  const [startDate, endDate] = React.useMemo(
    () => [
      startDateStr && moment(startDateStr),
      endDateStr && moment(endDateStr),
    ],
    [startDateStr, endDateStr]
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

  return (
    <Box
      d="flex"
      className={classNames('gantt', classes.root, {
        [classes.rtl]: rtl,
      })}
    >
      <GanttTable {...{ items, records, activeRowIndex, setActiveRowIndex }} />
      <Box
        ref={setContainer}
        flex="1"
        className={classes.container}
        onScroll={handleScroll}
      >
        {config && startDate && endDate && (
          <div
            className={classes.gantt}
            style={{
              width: config.totalWidth,
            }}
          >
            <GanttView
              view={view}
              hourSize={config.hourSize}
              cellSize={config.cellWidth}
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
