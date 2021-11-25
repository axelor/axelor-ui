import React from 'react';
import moment from 'moment';
import * as TYPES from './types';
import { GanttLine } from './gantt-line';
import { GanttHeader } from './gantt-header';
import { GanttBody } from './gantt-body';
import { GanttEdge } from './gantt-edge';
import { Box } from '../box';
import { styleNames } from '../styles';
import { getGraphConfig, getHeader, getGraphEdges } from './utils';
import classes from './gantt.module.css';

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

  const config = React.useMemo(
    () => container && getGraphConfig(records, view, container.offsetWidth),
    [container, records, view]
  );

  return (
    <Box d="flex" className={classes.container}>
      <Box className={classes.table}>
        <div className={classes.tableHeader}>
          {items.map(item => (
            <div key={item.name} className={classes.tableHeaderCell}>
              {item.title}
            </div>
          ))}
        </div>
        <div className={classes.tableBody}>
          {records.map((record, ind) => (
            <div
              key={ind}
              className={styleNames(classes.tableBodyRow, {
                [classes.active]: activeRowIndex === ind,
              })}
              onClick={e => setActiveRowIndex(ind)}
            >
              {items.map(item => (
                <div key={item.name} className={classes.tableBodyRowCell}>
                  {item.targetName
                    ? record[item.name] &&
                      (record[item.name] as any)[item.targetName]
                    : record[item.name]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Box>
      <Box flex="1" ref={setContainer}>
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
              cellSize={config.cellWidth}
              startDate={config.startDate}
              endDate={config.endDate}
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
