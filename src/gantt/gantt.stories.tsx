import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Box } from "../core";
import { useClassNames } from "../core";

import { Gantt } from "./gantt";
import { GANTT_TYPES } from "./utils";
import * as TYPES from "./types";

import response from "./data";

const config = {
  component: Gantt,
  title: "Advance/Gantt",
};

const connectSetTypes: any = {
  start_finish: "startToFinish",
  finish_finish: "finishToFinish",
  start_start: "startToStart",
  finish_start: "finishToStart",
};

export const Basic = () => {
  const [records, setRecords] = React.useState<TYPES.GanttRecord[]>(() =>
    response.data.map((taskData: any) => ({ ...taskData, taskData })),
  );

  const [view, setView] = React.useState(GANTT_TYPES.MONTH);
  const handleRecordUpdate = React.useCallback(
    (record: TYPES.GanttData, changes: Partial<TYPES.GanttRecord>) => {
      setRecords((_records) => {
        return _records.map((r) =>
          r.id === record.id ? { ...r, ...changes } : r,
        );
      });
    },
    [],
  );

  const handleRecordConnect = React.useCallback(
    ({ startId, finishId, source, target }: TYPES.ConnectProps) => {
      setRecords((_records) => {
        const set = connectSetTypes[`${source}_${target}`];
        const index = _records.findIndex((r) => r.id === finishId);
        const oldSet: TYPES.GanttData[] = (_records[index] as any)[set] || [];
        if (!oldSet.find((obj) => obj.id === startId)) {
          _records[index] = {
            ..._records[index],
            [set]: ((_records[index] as any)[set] || []).concat([
              { id: startId },
            ]),
          };
          return [..._records];
        }
        return _records;
      });
    },
    [],
  );

  const handleRecordDisconnect = React.useCallback(
    ({ startId, finishId, source, target }: TYPES.ConnectProps) => {
      const flag = window.confirm("Are you sure want to remove?");
      if (flag) {
        setRecords((_records) => {
          const set = connectSetTypes[`${source}_${target}`];
          const index = _records.findIndex((r) => r.id === finishId);
          const oldSet: TYPES.GanttData[] = (_records[index] as any)[set] || [];
          if (oldSet.find((obj) => obj.id === startId)) {
            _records[index] = {
              ..._records[index],
              [set]: ((_records[index] as any)[set] || []).filter(
                (x: TYPES.GanttData) => `${x.id}` !== `${startId}`,
              ),
            };
            return [..._records];
          }
          return _records;
        });
      }
    },
    [],
  );

  const classNames = useClassNames();

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <Box style={{ width: 300, marginBottom: 10 }}>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as any)}
            className={classNames("form-control")}
          >
            <option value={GANTT_TYPES.DAY}>Day</option>
            <option value={GANTT_TYPES.WEEK}>Week</option>
            <option value={GANTT_TYPES.MONTH}>Month</option>
            <option value={GANTT_TYPES.YEAR}>Year</option>
          </select>
        </Box>
        <Gantt
          view={view}
          items={response.items}
          records={records}
          onRecordConnect={handleRecordConnect}
          onRecordDisconnect={handleRecordDisconnect}
          onRecordUpdate={handleRecordUpdate}
        />
      </Box>
    </DndProvider>
  );
};

export default config;
