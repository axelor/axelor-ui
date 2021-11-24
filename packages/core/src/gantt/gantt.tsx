import React from 'react';
import moment from 'moment';
import * as TYPES from './types';
import { GanttLine } from './gantt-line';
import { GanttHeader } from './gantt-header';
import { GanttBody } from './gantt-body';
import { GanttEdge } from './gantt-edge';
import { Box } from '../box';
import { getGraphConfig, getHeader, getGraphEdges } from './utils';
import classes from './gantt.module.css';

function GanttView(props: {
  view: TYPES.GanttType;
  records: TYPES.GanttRecord[];
  startDate: moment.Moment;
  endDate: moment.Moment;
  hourSize: number;
  onRecordUpdate?: TYPES.GanttProps['onRecordUpdate'];
  onRecordConnect?: TYPES.GanttProps['onRecordConnect'];
}) {
  const {
    view,
    records,
    startDate,
    hourSize,
    endDate,
    onRecordUpdate,
    onRecordConnect,
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
        <GanttBody items={items} totalRecords={records.length}>
          {records.map((record, i) => {
            return (
              <GanttLine
                key={i}
                index={i}
                view={view}
                startDate={startDate}
                endDate={endDate}
                hourSize={hourSize}
                data={record}
                onUpdate={onRecordUpdate}
                onConnect={onRecordConnect}
              />
            );
          })}
        </GanttBody>
        {edges.map((edge, i) => (
          <GanttEdge key={i} edge={edge} />
        ))}
      </div>
    </div>
  );
}

export function Gantt({
  records,
  view,
  onRecordUpdate,
  onRecordConnect,
}: TYPES.GanttProps) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [, refresh] = React.useReducer(x => x + 1, 0);

  const config = React.useMemo(
    () => container && getGraphConfig(records, view, container.offsetWidth),
    [container, records, view]
  );

  console.count('gantt');
  return (
    <Box ref={setContainer} className={classes.container}>
      {/* <button onClick={() => refresh()}> refresh </button> */}
      {config && (
        <div
          className={classes.gantt}
          style={{
            width: config.totalWidth,
          }}
        >
          <GanttView
            view={view}
            hourSize={config.hourSize}
            startDate={config.startDate}
            endDate={config.endDate}
            records={records}
            onRecordConnect={onRecordConnect}
            onRecordUpdate={onRecordUpdate}
          />
        </div>
      )}
    </Box>
  );
}
