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
  onRecordDisconnect?: TYPES.GanttProps['onRecordDisconnect'];
}) {
  const {
    view,
    records,
    startDate,
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
          <GanttEdge key={i} edge={edge} onDelete={onRecordDisconnect} />
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
  onRecordDisconnect,
}: TYPES.GanttProps) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);

  const config = React.useMemo(
    () => container && getGraphConfig(records, view, container.offsetWidth),
    [container, records, view]
  );

  return (
    <Box ref={setContainer} className={classes.container}>
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
            onRecordDisconnect={onRecordDisconnect}
            onRecordUpdate={onRecordUpdate}
          />
        </div>
      )}
    </Box>
  );
}
